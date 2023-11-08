'use client';

type LogInButtonProps = Omit<
  JSX.IntrinsicElements['button'],
  'children' | 'onClick'
>;

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProviders, signIn } from 'next-auth/react';

export const LogInButton = ({ ...buttonProps }: LogInButtonProps) => {
  const { data: providers } = useQuery({
    queryKey: ['getProviders'],
    queryFn: getProviders,
  });

  const handleSignIn = useCallback(() => {
    signIn(providers?.google.id);
  }, [providers?.google.id]);

  return (
    <button onClick={handleSignIn} {...buttonProps}>
      Log In
    </button>
  );
};
