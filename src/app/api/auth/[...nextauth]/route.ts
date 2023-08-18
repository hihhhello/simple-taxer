import NextAuth from 'next-auth';

import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from '@/server';

export const NEXT_AUTH_OPTIONS: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (!params.token.email) {
        params.token.user = null;

        return params.token;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: params.token.email,
        },
      });

      if (!user) {
        params.token.user = null;

        return params.token;
      }

      params.token.user = user;

      return params.token;
    },
    session(params) {
      params.session.user = params.token.user;

      return params.session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(NEXT_AUTH_OPTIONS);

export { handler as GET, handler as POST };
