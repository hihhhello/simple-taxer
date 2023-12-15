export type AnalyticsSourceIncome = {
  sourceName: string | null;
  _sum: { amount: number | null };
};

export type AnalyticsIncomeTrend = {
  date: string;
  _sum: { amount: number | null };
};
