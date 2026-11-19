import nodemailer from 'nodemailer';
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
 * Sends email using Brevo (Sendinblue) SMTP.
 * In development, logs to console if credentials are not set.
 */
export async function sendEmail(message: EmailMessage) {
  const text = renderText(message);
  const html = renderHtml(message);

  // If Brevo credentials are not set, log to console (development mode)
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SMTP_KEY) {
    console.info(`[email] To: ${message.to}\n[email] Subject: ${message.subject}\n${text}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_KEY,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    await transporter.sendMail({
      from: `${siteConfig.name} <${process.env.BREVO_SENDER_EMAIL || 'noreply@textory.com'}>`,
      to: message.to,
      subject: message.subject,
      text,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
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

function renderHtml(message: EmailMessage) {
  const codeBoxes = message.code
    ? `
    <div style="display: flex; gap: 8px; justify-content: center; margin: 24px 0;">
      ${message.code.split('').map((digit) => `
        <div style="width: 40px; height: 48px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border: 1px solid #ddd; border-radius: 8px; font-size: 24px; font-weight: bold; color: #333;">
          ${digit}
        </div>
      `).join('')}
    </div>
  `
    : '';

  const actionButton = message.action
    ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${message.action.url}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
        ${message.action.label}
      </a>
    </div>
  `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${message.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: #1a1a2e; color: #e0e0e0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #16162a; border-radius: 12px; padding: 32px; border: 1px solid #2a2a4a;">
          ${message.eyebrow ? `<p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #818cf8;">${message.eyebrow}</p>` : ''}
          <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #fff;">${message.title}</h1>
          ${message.paragraphs.map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #a0a0b0;">${p}</p>`).join('')}
          ${codeBoxes}
          ${actionButton}
          ${message.note ? `<p style="margin: 24px 0 0 0; font-size: 12px; color: #606080;">${message.note}</p>` : ''}
          <p style="margin: 32px 0 0 0; font-size: 12px; color: #404060;">— ${siteConfig.name}</p>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}
