import { ApiError, conflict } from '@/lib/api';
import { passwordResetCodeEmail, sendEmail, signUpCodeEmail, verificationEmail, type EmailMessage } from '@/lib/email';
import {
  CODE_LIFETIME_MINUTES,
  codeError,
  codeHash,
  codeMatches,
  issueAuthToken,
  issueCode,
  MAX_CODE_ATTEMPTS,
  newCode,
} from '@/lib/tokens';
import PendingSignupModel from '@/models/PendingSignup';
import UserModel, { type IUser } from '@/models/User';

type Recipient = Pick<IUser, '_id' | 'email'>;

export async function sendVerificationEmail(user: Recipient) {
  const token = await issueAuthToken(user._id, 'verify-email');
  await sendEmail(verificationEmail(user.email, token));
}

/** Sends an email whose code the user is waiting for, so a failure is reported instead of ignored. */
async function sendCodeEmail(message: EmailMessage) {
  try {
    await sendEmail(message);
  } catch (error) {
    console.error(error);
    throw new ApiError(502, 'EMAIL_FAILED', "We couldn't send an email to that address. Check it and try again.");
  }
}

export async function sendPasswordResetCode(user: Recipient) {
  const code = await issueCode(user._id, 'reset-password-code');
  await sendCodeEmail(passwordResetCodeEmail(user.email, code));
}

/** Throws a 409 naming the fields when the username or email already belongs to an account. */
export async function assertAccountAvailable({ username, email }: { username: string; email: string }) {
  const existing = await UserModel.find({ $or: [{ username }, { email }] }).select('username email').lean();
  if (existing.length === 0) return;
  throw conflict('That username or email is already in use.', {
    ...(existing.some((user: any) => user.username === username) && { username: ['This username is taken.'] }),
    ...(existing.some((user: any) => user.email === email) && { email: ['An account with this email already exists.'] }),
  });
}

/**
 * Creates an account directly without email verification.
 */
export async function createAccount(input: { username: string; email: string; displayName?: string; passwordHash: string }) {
  await assertAccountAvailable(input);
  const user = await UserModel.create({
    username: input.username,
    email: input.email,
    displayName: input.displayName ?? input.username,
    passwordHash: input.passwordHash,
  });
  return user;
}

/**
 * Step 1 of signing up (after `assertAccountAvailable`): remembers the details and emails a
 * 6-digit code. Asking again replaces the earlier code. The account itself is made by `finishSignUp`.
 */
export async function startSignUp(input: { username: string; email: string; displayName?: string; passwordHash: string }) {
  const code = newCode();
  await PendingSignupModel.findOneAndUpdate(
    { email: input.email },
    {
      $set: {
        username: input.username,
        displayName: input.displayName ?? null,
        passwordHash: input.passwordHash,
        codeHash: codeHash(input.email, code),
        attempts: 0,
        expiresAt: new Date(Date.now() + CODE_LIFETIME_MINUTES * 60 * 1000),
      },
    },
    { upsert: true },
  );
  await sendCodeEmail(signUpCodeEmail(input.email, code));
}

/** Step 2: checks the emailed code and creates the account, with its email already verified. */
export async function finishSignUp(email: string, code: string) {
  const pending = await PendingSignupModel.findOne({ email, expiresAt: { $gt: new Date() } })
    .select('+passwordHash')
    .lean();
  if (!pending) throw codeError('expired');
  if (!codeMatches(pending.codeHash, email, code)) {
    const counted = await PendingSignupModel.findOneAndUpdate({ _id: pending._id }, { $inc: { attempts: 1 } }, { new: true }).lean();
    if (!counted || counted.attempts >= MAX_CODE_ATTEMPTS) {
      await PendingSignupModel.deleteOne({ _id: pending._id });
      throw codeError('locked');
    }
    throw codeError('wrong');
  }

  // Someone may have taken the username since the code was sent.
  await assertAccountAvailable(pending);
  const user = await UserModel.create({
    username: pending.username,
    email,
    displayName: pending.displayName ?? pending.username,
    passwordHash: pending.passwordHash,
    emailVerifiedAt: new Date(),
  });
  await PendingSignupModel.deleteOne({ _id: pending._id });
  return user;
}

