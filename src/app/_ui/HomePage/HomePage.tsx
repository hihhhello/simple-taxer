'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { formatISO, parseISO } from 'date-fns';

import { formatToUSDCurrency } from '@/shared/utils';
import { AddNewTransactionForm } from '@/features/AddNewTransactionForm';
import { TransactionTable, TransactionTableProps } from '@/shared/ui';
import { api } from '@/shared/api';
import { useLoadingToast } from '@/shared/utils/hooks';
import { IncomeTaxCalculator } from '@/features/IncomeTaxCalculator';
import { HomePageTabs } from './ui/HomePageTabs';
import { HomePageTab } from './utils/homePageTypes';
import { IncomeBySourcePieChart } from '@/features/IncomeBySourcePieChart';

type HomePageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
};

export const HomePageContent = ({
  transactions: initialTransactions,
}: HomePageContentProps) => {
  const loadingToast = useLoadingToast();

  const [transactionsStartDate, setTransactionsStartDate] = useState<Date>();
  const [transactionsEndDate, setTransactionsEndDate] = useState<Date>();

  const { data: transactions, refetch: refetchTransactions } =
    api.transactions.getAll.useQuery(
      {},
      {
        initialData: initialTransactions,
        queryKey: [
          'transactions.getAll',
          { startDate: transactionsStartDate, endDate: transactionsEndDate },
        ],
      },
    );
  const { data: transactionsBySourceName } =
    api.transactions.getBySourceName.useQuery({});

  const { mutate: apiDeleteTransaction } =
    api.transactions.delete.useMutation();
  const { mutate: apiDeleteManyTransactions } =
    api.transactions.deleteMany.useMutation();
  const { mutate: apiEditTransaction } = api.transactions.edit.useMutation();
  const { mutate: apiDuplicateTransaction } =
    api.transactions.duplicate.useMutation();

  const [transactionToDeleteId, setTransactionToDeleteId] = useState<number>();

  const [currentTab, setCurrentTab] = useState<HomePageTab>(
    HomePageTab.TRANSACTIONS,
  );

  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');

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

  const handleChangeTransactionSearchQuery = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setTransactionSearchQuery(event.target.value),
    [],
  );

  const searchedTransactions = useMemo(
    () =>
      transactionSearchQuery
        ? transactions?.filter(({ bankName, sourceName }) => {
            const searchQueryRegExp = new RegExp(transactionSearchQuery, 'ig');

            return (
              bankName?.match(searchQueryRegExp) ??
              sourceName?.match(searchQueryRegExp)
            );
          })
        : transactions,
    [transactionSearchQuery, transactions],
  );

  return (
    <div>
      <div className="mb-4">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:col-start-2 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Total Income
            </dt>

            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {formatToUSDCurrency(totalIncome)}
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
        if (currentTab === HomePageTab.TRANSACTIONS) {
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

                <div className="mb-4 grid grid-cols-1 items-end gap-x-2 gap-y-4 sm:grid-cols-3">
                  <div>
                    <input
                      name="transactionSearchQuery"
                      id="transactionSearchQuery"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-auto sm:text-sm sm:leading-6"
                      placeholder="Search source or bank name"
                      value={transactionSearchQuery}
                      onChange={handleChangeTransactionSearchQuery}
                    />
                  </div>

                  <div className="flex flex-col gap-x-2 gap-y-4 sm:flex-row">
                    <div>
                      <label htmlFor="transactionSearchQuery">Start date</label>

                      <input
                        type="date"
                        name="transactionsStartDate"
                        id="transactionsStartDate"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-auto sm:text-sm sm:leading-6"
                        placeholder="Start date"
                        value={
                          transactionsStartDate
                            ? formatISO(transactionsStartDate, {
                                representation: 'date',
                              })
                            : ''
                        }
                        onChange={(e) =>
                          setTransactionsStartDate(parseISO(e.target.value))
                        }
                      />
                    </div>

                    <div>
                      <label htmlFor="transactionSearchQuery">End date</label>

                      <input
                        type="date"
                        name="transactionsSEndDate"
                        id="transactionsSEndDate"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-auto sm:text-sm sm:leading-6"
                        placeholder="End date"
                        value={
                          transactionsEndDate
                            ? formatISO(transactionsEndDate, {
                                representation: 'date',
                              })
                            : ''
                        }
                        onChange={(e) =>
                          setTransactionsEndDate(parseISO(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="max-h-[calc(100vh/3)] overflow-y-auto">
                  <TransactionTable
                    transactions={searchedTransactions}
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

        if (currentTab === HomePageTab.ANALYTICS) {
          if (!transactionsBySourceName) {
            return null;
          }

          return (
            <div>
              <div className="mb-4">
                <h1 className="text-lg font-bold leading-6 text-gray-900">
                  Income by source
                </h1>
              </div>

              <IncomeBySourcePieChart
                transactionsBySourceName={transactionsBySourceName}
              />
            </div>
          );
        }

        if (currentTab === HomePageTab.CALCULATOR) {
          return (
            <div>
              <IncomeTaxCalculator totalIncome={totalIncome} />
            </div>
          );
        }

        return null;
      })()}
    </div>
  );
};
