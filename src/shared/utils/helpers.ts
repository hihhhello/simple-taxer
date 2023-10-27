import { Transaction } from '../types/transactionTypes';

const usdDecimalFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatUSDDecimal = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return usdDecimalFormatter.format(value);
};

const usdIntegerFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatUSDInteger = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return usdIntegerFormatter.format(value);
};

export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const calculateTotalIncome = (
  transactions: Transaction[] | undefined,
) => {
  if (!transactions) {
    return 0;
  }

  return transactions.reduce((totalIncomeAccumulator, transaction) => {
    if (transaction.amount > 0) {
      return totalIncomeAccumulator + transaction.amount;
    }

    return totalIncomeAccumulator;
  }, 0);
};
