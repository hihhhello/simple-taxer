import { Transaction } from '@/shared/types/transactionTypes';

type TransactionListProps = {
  transactions: Transaction[] | undefined;
  transactionToDeleteId?: number;
  makeHandleDeleteTransaction: (transactionId: number) => () => void;
  makeHandleDuplicateTransaction: (transactionId: number) => () => void;
};

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return <div>list</div>;
};
