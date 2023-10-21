export type Transaction = {
  id: number;
  amount: number;
  bankName: string | null;
  sourceName: string | null;
  date: Date;
};

export type TransactionSortField =
  | 'amount'
  | 'bankName'
  | 'sourceName'
  | 'date';
