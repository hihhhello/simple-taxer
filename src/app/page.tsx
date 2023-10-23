import { getServerSession } from 'next-auth';

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  if (!session?.user) {
    return redirect('/calculator');
  }

  return redirect('/transactions');
}
