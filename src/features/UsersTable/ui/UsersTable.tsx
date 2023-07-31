'use client';

import { useQuery } from '@tanstack/react-query';

import { apiJsonPlaceholder } from '@/shared/api';
import { User } from '@/shared/types';
import { trpc } from '@/shared/utils/trpc';

type UsersTableProps = {
  users: User[];
};

export const UsersTable = ({ users: initialUsers }: UsersTableProps) => {
  const { data } = trpc.greeting.useQuery({
    name: 'Anton',
  });

  console.log(data, 'client');

  return <div>Hello world {data}</div>;
};
