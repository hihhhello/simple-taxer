export const HomePageTabKey = {
  TRANSACTIONS: 'transactions',
  ANALYTICS: 'analytics',
  CALCULATOR: 'calculator',
} as const;

export type HomePageTab = (typeof HomePageTabKey)[keyof typeof HomePageTabKey];
