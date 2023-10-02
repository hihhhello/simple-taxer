'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';

import { formatToUSDCurrency } from '@/shared/utils';
import { AddNewTransactionForm } from '@/features/AddNewTransactionForm';
import { TransactionTable, TransactionTableProps } from '@/shared/ui';
import { api } from '@/shared/api';
import { useLoadingToast } from '@/shared/utils/hooks';
import { TaxCalculator } from '@/features/TaxCalculator';
import { HomePageTabs } from './_ui/HomePageTabs';

type HomePageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
};

export const HomePageContent = ({
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const loadingToast = useLoadingToast();

  const { data: transactions, refetch: refetchTransactions } =
    api.transactions.getAll.useQuery(
      {},
      {
        initialData: initialTransactions,
      },
    );

  const { mutate: apiDeleteTransaction } =
    api.transactions.delete.useMutation();
  const { mutate: apiDeleteManyTransactions } =
    api.transactions.deleteMany.useMutation();
  const { mutate: apiEditTransaction } = api.transactions.edit.useMutation();
  const { mutate: apiDuplicateTransaction } =
    api.transactions.duplicate.useMutation();

  const [taxPercent, setTaxPercent] = useState(0);

  const [transactionToDeleteId, setTransactionToDeleteId] = useState<number>();

  const [currentTab, setCurrentTab] = useState<'transactions' | 'calculator'>(
    'transactions',
  );

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
        const toastId = loadingToast.showLoading('Deleting transactions...');

        apiDeleteManyTransactions(
          {
            transactionIds,
          },
          {
            onSuccess: () => {
              loadingToast.handleSuccess({
                message: 'Transactions successfully deleted.',
                toastId,
              });
              setSelectedTransactions([]);

              refetchTransactions();
            },
            onError: () => {
              loadingToast.handleError({
                message: 'Transactions deleting error. Try again.',
                toastId,
              });
            },
          },
        );
      },
      [apiDeleteManyTransactions, loadingToast, refetchTransactions],
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

  const makeHandleDuplicateTransaction = (transactionId: number) => () => {
    const toastId = loadingToast.showLoading('Duplicating...');

    apiDuplicateTransaction(
      {
        transactionId,
      },
      {
        onSuccess: () => {
          loadingToast.handleSuccess({
            message: 'Transaction has been duplicated.',
            toastId,
          });

          refetchTransactions();
        },

        onError: () => {
          loadingToast.handleError({
            message:
              'Something gone wrong while duplicating transaction. Try again.',
            toastId,
          });
        },
      },
    );
  };

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

  const handleEditTransaction: TransactionTableProps['handleSubmitEditTransaction'] =
    useCallback(
      ({ newValues, transactionId }) => {
        const toastId = toast.loading('Editing transaction...');

        apiEditTransaction(
          {
            newValues: {
              ...newValues,
              date: newValues.date ? parseISO(newValues.date) : undefined,
            },
            transactionId,
          },
          {
            onSuccess: () => {
              toast.update(toastId, {
                render: 'Transactions successfully changed.',
                type: 'success',
                autoClose: 2500,
                isLoading: false,
              });

              refetchTransactions();
            },
            onError: () => {
              toast.update(toastId, {
                render: 'Transaction editing error. Try again.',
                type: 'error',
                autoClose: 2500,
                isLoading: false,
              });
            },
          },
        );
      },
      [apiEditTransaction, refetchTransactions],
    );

  return (
    <div>
      <div className="mb-4">
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

      <HomePageTabs
        currentTab={currentTab}
        handleSelectTab={setCurrentTab}
        className="mb-4"
      />

      {(() => {
        if (currentTab === 'transactions') {
          return (
            <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-3 sm:gap-x-16">
              <AddNewTransactionForm
                handleSuccessSubmit={refetchTransactions}
              />

              <div className="col-span-2">
                <div className="mb-4 sm:flex-auto">
                  <h1 className="text-lg font-bold leading-6 text-gray-900">
                    Transactions
                  </h1>
                </div>

                <div className="max-h-[calc(100vh/3)] overflow-y-auto">
                  <TransactionTable
                    transactions={transactions}
                    handleDeleteAllTransactions={handleDeleteAllTransactions}
                    makeHandleDeleteTransaction={makeHandleDeleteTransaction}
                    makeHandleDuplicateTransaction={
                      makeHandleDuplicateTransaction
                    }
                    transactionToDeleteId={transactionToDeleteId}
                    handleSubmitEditTransaction={handleEditTransaction}
                  />
                </div>
              </div>
            </div>
          );
        }

        if (currentTab === 'calculator') {
          return (
            <div>
              <TaxCalculator totalIncome={totalIncome} />
            </div>
          );
        }

        return null;
      })()}
    </div>
  );
};
