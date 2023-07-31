import { appRouter } from '@/server/routers/_app';

export default async function Home() {
  const caller = appRouter.createCaller({});

  console.log(
    'caller users',
    await caller.greeting({
      name: 'Anton',
    }),
  );

  return (
    <>
      <h1>Home page</h1>
    </>
  );
}
