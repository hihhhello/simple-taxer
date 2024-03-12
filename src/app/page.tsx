import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { NEXT_AUTH_OPTIONS } from '@/shared/utils/nextAuth';

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH_OPTIONS);

  if (!session?.user) {
    return redirect('/calculator');
  }

  return redirect('/transactions');
}
