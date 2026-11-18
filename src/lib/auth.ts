import bcrypt from 'bcryptjs';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import UserModel, { type IUser } from '@/models/User';
import { signInSchema } from '@/schemas/auth';
import { clientIp, unauthorized } from './api';
import { dbConnect } from './db';
import { consumeRateLimit } from './rate-limit';

export const PASSWORD_HASH_ROUNDS = 12;

// One message for every failure so sign-in doesn't reveal which accounts exist.
const INVALID_CREDENTIALS = 'Invalid email/username or password.';

/** Session token fields that come from the account. */
function accountClaims(user: IUser): Partial<JWT> {
  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role,
    email: user.email,
    name: user.displayName,
    picture: user.avatar?.url ?? null,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email or username',
      credentials: {
        identifier: { label: 'Email or username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) throw new Error(INVALID_CREDENTIALS);
        const identifier = parsed.data.identifier.toLowerCase();

        await dbConnect();
        const ip = clientIp(request?.headers);
        const allowed =
          (await consumeRateLimit(`sign-in:ip:${ip}`, 50, 15 * 60)) &&
          (await consumeRateLimit(`sign-in:account:${ip}:${identifier}`, 10, 15 * 60));
        if (!allowed) throw new Error('Too many sign-in attempts. Try again in a few minutes.');

        const user = await UserModel.findOne({ $or: [{ email: identifier }, { username: identifier }] })
          .select('+passwordHash')
          .lean();
        if (!user?.passwordHash || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
          throw new Error(INVALID_CREDENTIALS);
        }

        return {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
          email: user.email,
          name: user.displayName,
          image: user.avatar?.url ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      // The client calls `useSession().update()` after editing the profile to refresh these.
      if (trigger === 'update' && token.id) {
        await dbConnect();
        const fresh = await UserModel.findById(token.id).lean();
        if (fresh) Object.assign(token, accountClaims(fresh));
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/sign-in', error: '/sign-in' },
};

export type SessionUser = { id: string; username: string; role: 'user' | 'admin' };

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { id, username, role } = session.user;
  return { id, username, role };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw unauthorized();
  return user;
}

export const isAdmin = (user: SessionUser | null) => user?.role === 'admin';
