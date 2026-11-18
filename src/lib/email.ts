import { appUrl, siteConfig } from '@/config/site';
import { CODE_LIFETIME_MINUTES } from './tokens';

/** What an email says. `sendEmail` lays it out in the app's dark theme. */
export type EmailMessage = {
  to: string;
  subject: string;
  /** The line inboxes show after the subject. */
  preview: string;
  /** Small orchid label above the title. */
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** A 6-digit code, shown as six boxes like the code boxes in the app. */
  code?: string;
  action?: { label: string; url: string };
  note?: string;
};

/**
 * Logs email to console for development use.
 */
export async function sendEmail(message: EmailMessage) {
  const text = renderText(message);
  console.info(`[email] To: ${message.to}\n[email] Subject: ${message.subject}\n${text}`);
}

// ---- Messages ------------------------------------------------------------------------------

export function signUpCodeEmail(to: string, code: string): EmailMessage {
  return {
    to,
    subject: `${code} is your ${siteConfig.name} code`,
    preview: `Enter ${code} to finish signing up.`,
    eyebrow: 'Verify your email',
    title: 'Finish signing up',
    paragraphs: [`Enter this code on ${siteConfig.name} to confirm your email and create your account.`],
    code,
    note: `The code works for ${CODE_LIFETIME_MINUTES} minutes. If you didn't try to sign up, ignore this email. No account is made without the code.`,
  };
}

export function passwordResetCodeEmail(to: string, code: string): EmailMessage {
  return {
    to,
    subject: `${code} is your ${siteConfig.name} password reset code`,
    preview: `Enter ${code} to choose a new password.`,
    eyebrow: 'Password reset',
    title: 'Reset your password',
    paragraphs: [`Someone asked to reset the password for your ${siteConfig.name} account. Enter this code to choose a new one.`],
    code,
    note: `The code works for ${CODE_LIFETIME_MINUTES} minutes. If this wasn't you, ignore this email. Your password stays the same.`,
  };
}

/** For accounts made before sign-up codes, which can still confirm their email from Settings. */
export function verificationEmail(to: string, token: string): EmailMessage {
  return {
    to,
    subject: `Verify your email for ${siteConfig.name}`,
    preview: 'Confirm this is your email address.',
    eyebrow: 'Verify your email',
    title: 'Confirm your email',
    paragraphs: [`Tap the button to confirm this is the email address for your ${siteConfig.name} account.`],
    action: { label: 'Verify email', url: appUrl(`/verify-email?token=${token}`) },
    note: "The link works for 24 hours. If you didn't ask for this, ignore this email.",
  };
}

function renderText(message: EmailMessage) {
  return [
    message.title,
    ...message.paragraphs,
    message.code && `Your code: ${message.code}`,
    message.action && `${message.action.label}: ${message.action.url}`,
    message.note,
    `— ${siteConfig.name}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}
