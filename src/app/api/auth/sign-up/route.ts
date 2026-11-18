import bcrypt from 'bcryptjs';
import { clientIp, ok, readJson, route } from '@/lib/api';
import { PASSWORD_HASH_ROUNDS } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { signUpSchema } from '@/schemas/auth';
import { assertAccountAvailable, createAccount } from '@/server/accounts';

/**
 * Creates an account directly without email verification.
 */
export const POST = route(async (request) => {
  await enforceRateLimit(`sign-up:${clientIp(request.headers)}`, 10, 60 * 60);
  const input = await readJson(request, signUpSchema);
  await assertAccountAvailable(input);
  await enforceRateLimit(`sign-up:email:${input.email}`, 5, 60 * 60, 'Too many sign-up attempts for this email. Try again in an hour.');

  await createAccount({
    ...input,
    passwordHash: await bcrypt.hash(input.password, PASSWORD_HASH_ROUNDS),
  });
  return ok({ email: input.email }, 201);
});
