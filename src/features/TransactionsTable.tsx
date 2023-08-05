'use client';

import { classNames, formatToUSDCurrency } from '@/shared/utils/helpers';
import { RouterOutputs, trpc } from '@/shared/utils/trpc';
import { format, parseISO } from 'date-fns';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

type NewTransactionFormValues = {
  date: string;
  amount: number;
  bankName?: string;
  sourceName?: string;
};

type TransactionsTableProps = {
  transactions: RouterOutputs['transactions']['getAll'];
};

export const TransactionsTable = ({
  transactions: initialTransactions,
}: TransactionsTableProps) => {
  const { data: transactions, refetch: refetchTransactions } =
    trpc.transactions.getAll.useQuery(undefined, {
      initialData: initialTransactions,
    });

  const {
    mutate: apiCreateNewTransaction,
    isLoading: isCreateNewTransactionLoading,
  } = trpc.transactions.create.useMutation();

  const {
    mutate: apiDeleteTransaction,
    isLoading: isDeleteTransactionLoading,
  } = trpc.transactions.delete.useMutation();

  const [taxPercent, setTaxPercent] = useState(0);

  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null,
  );

  const [newTransactionFormValues, setNewTransactionFormValues] =
    useState<NewTransactionFormValues>({
      date: '',
      amount: 0,
      bankName: undefined,
      sourceName: undefined,
    });

  const makeHandleChangeNewTransactionFormValues =
    <TFieldKey extends keyof NewTransactionFormValues>(field: TFieldKey) =>
    (newValue: NewTransactionFormValues[TFieldKey]) => {
      setNewTransactionFormValues((prevFormValues) => ({
        ...prevFormValues,
        [field]: newValue,
      }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    apiCreateNewTransaction(
      {
        ...newTransactionFormValues,
        date: parseISO(newTransactionFormValues.date),
      },
      {
        onSuccess: () => {
          toast('New transactions has been added.', {
            type: 'success',
          });

          setNewTransactionFormValues({
            amount: 0,
            date: '',
            bankName: '',
            sourceName: '',
          });

          refetchTransactions();
        },
      },
    );
  };

  const makeHandleDeleteTransaction = (transactionId: number) => () => {
    setTransactionToDelete(transactionId);

    apiDeleteTransaction(
      {
        transactionId,
      },
      {
        onSuccess: () => {
          toast('Transaction has been deleted', {
            type: 'success',
          });

          refetchTransactions();
        },
      },
    );
  };

  const totalIncome = transactions.reduce(
    (totalIncomeAccumulator, transaction) => {
      if (transaction.amount > 0) {
        return totalIncomeAccumulator + transaction.amount;
      }

      return totalIncomeAccumulator;
    },
    0,
  );

  return (
    <div>
      <div className="mb-16">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Total Income
            </dt>

            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {formatToUSDCurrency(totalIncome)}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Taxes to pay
            </dt>

            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {formatToUSDCurrency(totalIncome * (taxPercent / 100))}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Tax % (Min 0 - Max 100)
            </dt>

            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              <div className="flex items-center">
                <input
                  required
                  type="text"
                  inputMode="decimal"
                  name="taxPercent"
                  id="taxPercent"
                  min={0}
                  max={100}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-3xl sm:leading-6"
                  placeholder="Tax Percent"
                  value={taxPercent.toString()}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (isNaN(value)) {
                      return;
                    }

                    if (value > 100 || value < 0) {
                      return;
                    }

                    setTaxPercent(Number(value));
                  }}
                />
                <span>%</span>
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        <div className="mb-16">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <span className="font-bold text-lg">Add New Transaction</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="date">Date</label>
                <input
                  required
                  type="date"
                  name="date"
                  id="date"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Date"
                  value={newTransactionFormValues.date}
                  onChange={(e) =>
                    makeHandleChangeNewTransactionFormValues('date')(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="amount">Amount</label>
                <input
                  required
                  type="number"
                  name="amount"
                  defaultValue={0}
                  id="amount"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Amount"
                  value={newTransactionFormValues.amount.toString()}
                  onChange={(e) =>
                    makeHandleChangeNewTransactionFormValues('amount')(
                      Number(e.target.value),
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  id="bankName"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Bank Name"
                  value={newTransactionFormValues.bankName}
                  onChange={(e) =>
                    makeHandleChangeNewTransactionFormValues('bankName')(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="sourceName">Source Name</label>
                <input
                  type="text"
                  name="sourceName"
                  id="sourceName"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Source Name"
                  value={newTransactionFormValues.sourceName}
                  onChange={(e) =>
                    makeHandleChangeNewTransactionFormValues('sourceName')(
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isCreateNewTransactionLoading ? 'Loading...' : 'Add +'}
            </button>
          </form>
        </div>

        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Transactions
              </h1>
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Id
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Bank Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Source Name
                      </th>
                      <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={classNames(
                          transactionToDelete === transaction.id &&
                            'animate-pulse cursor-not-allowed',
                        )}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {transaction.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(transaction.date, 'yyyy-MM-dd')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {transaction.amount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {transaction.bankName ?? '--'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {transaction.sourceName ?? '--'}
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 pr-4 sm:pr-0 cursor-pointer group"
                          onClick={makeHandleDeleteTransaction(transaction.id)}
                        >
                          <span className="text-red-600 group-hover:text-red-900 font-bold">
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
