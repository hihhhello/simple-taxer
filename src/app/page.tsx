import { UsersTable } from '@/features/UsersTable';
import { apiJsonPlaceholder } from '@/shared/api';

export default async function Home() {
  const users = await apiJsonPlaceholder.users.getUsers();

  return <UsersTable users={users} />;
}
