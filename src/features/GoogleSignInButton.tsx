'use client';

import { useQuery } from '@tanstack/react-query';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';

export const GoogleSignInButton = () => {
  const { data: providers } = useQuery({
    queryKey: ['getProviders'],
    queryFn: getProviders,
  });

  if (!providers) {
    return null;
  }

  return (
    <button
      className="flex gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow"
      onClick={() => signIn(providers.google.id)}
    >
      <Image
        width={24}
        height={24}
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>Login with Google</span>
    </button>
  );
};
