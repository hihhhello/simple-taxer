'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { formatToUSDCurrency } from '@/shared/utils';
import { AddNewTransactionForm } from '@/features/AddNewTransactionForm';
import { TransactionTable, TransactionTableProps } from '@/shared/ui';
import { api } from '@/shared/api';

type HomePageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
};

export const HomePageContent = ({
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const { data: transactions, refetch: refetchTransactions } =
    api.transactions.getAll.useQuery(undefined, {
      initialData: initialTransactions,
    });

  const { mutate: apiDeleteTransaction } =
    api.transactions.delete.useMutation();
  const { mutate: apiDeleteManyTransactions } =
    api.transactions.deleteMany.useMutation();

  const [taxPercent, setTaxPercent] = useState(0);

  const [transactionToDeleteId, setTransactionToDeleteId] = useState<number>();

  const makeHandleDeleteTransaction = (transactionId: number) => () => {
    setTransactionToDeleteId(transactionId);

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

  const handleDeleteAllTransactions: TransactionTableProps['handleDeleteAllTransactions'] =
    useCallback(
      (transactionIds, setSelectedTransactions) => {
        const toastId = toast.loading('Deleting transactions...');

        apiDeleteManyTransactions(
          {
            transactionIds,
          },
          {
            onSuccess: () => {
              setSelectedTransactions([]);

              toast.update(toastId, {
                render: 'Transactions deleted successfully.',
                type: 'success',
                autoClose: 2500,
                isLoading: false,
              });

              refetchTransactions();
            },
            onError: () => {
              toast.update(toastId, {
                render: 'Transactions deleting error. Try again.',
                type: 'error',
                autoClose: 2500,
                isLoading: false,
              });
            },
          },
        );
      },
      [apiDeleteManyTransactions, refetchTransactions],
    );

  const handleChangeTaxPercent = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      if (isNaN(value)) {
        return;
      }

      if (value > 100 || value < 0) {
        return;
      }

      setTaxPercent(Number(value));
    },
    [],
  );

  const totalIncome = useMemo(
    () =>
      transactions
        ? transactions.reduce((totalIncomeAccumulator, transaction) => {
            if (transaction.amount > 0) {
              return totalIncomeAccumulator + transaction.amount;
            }

            return totalIncomeAccumulator;
          }, 0)
        : 0,
    [transactions],
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
                  type="number"
                  inputMode="decimal"
                  name="taxPercent"
                  id="taxPercent"
                  min={0}
                  max={100}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-3xl sm:leading-6"
                  placeholder="Tax Percent"
                  value={taxPercent.toString()}
                  onChange={handleChangeTaxPercent}
                />
                <span>%</span>
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        <AddNewTransactionForm handleSuccessSubmit={refetchTransactions} />

        <div className="col-span-2">
          <div className="sm:flex-auto mb-4">
            <h1 className="text-lg font-bold leading-6 text-gray-900">
              Transactions
            </h1>
          </div>

          <div className="min-h-[calc(100vh/3)] max-h-[calc(100vh/2)] overflow-y-auto">
            <TransactionTable
              transactions={transactions}
              handleDeleteAllTransactions={handleDeleteAllTransactions}
              makeHandleDeleteTransaction={makeHandleDeleteTransaction}
              transactionToDeleteId={transactionToDeleteId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
