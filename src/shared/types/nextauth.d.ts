import { Prisma } from '@prisma/client';
import { DefaultSession } from 'next-auth';
import type { User } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User | null;
  }
}
