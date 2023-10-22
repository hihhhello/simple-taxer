import { Transaction } from '../types/transactionTypes';

const formatterUSDCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatToUSDCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return formatterUSDCurrency.format(value);
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
