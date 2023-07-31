import { UsersTable } from '@/features/UsersTable';
import { appRouter } from '@/server/routers/_app';
import { apiJsonPlaceholder } from '@/shared/api';

export default async function Home() {
  const users = await apiJsonPlaceholder.users.getUsers();

  const caller = appRouter.createCaller({});

  console.log(
    'caller users',
    await caller.greeting({
      name: 'Anton',
    }),
  );

  return <UsersTable users={users} />;
}
