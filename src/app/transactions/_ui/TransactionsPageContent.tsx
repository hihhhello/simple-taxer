'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { formatISO, parseISO } from 'date-fns';
import { User } from 'next-auth';
import { twMerge } from 'tailwind-merge';

import { AddNewTransactionForm } from '@/features/AddNewTransactionForm';
import {
  TransactionTable,
  TransactionTableProps,
} from '@/shared/ui/TransactionsTable';
import { api } from '@/shared/api';
import { useLoadingToast } from '@/shared/utils/hooks';
import { GoogleSignInButton } from '@/features/GoogleSignInButton';
import { classNames } from '@/shared/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { TransactionSortField } from '@/shared/types/transactionTypes';
import { SortOrder } from '@/shared/types/types';

type TransactionsPageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
  me: User | undefined | null;
};

export const TransactionsPageContent = ({
  transactions: initialTransactions,
  me,
}: TransactionsPageContentProps) => {
  const queryClient = useQueryClient();

  const loadingToast = useLoadingToast();

  const [transactionsStartDate, setTransactionsStartDate] = useState<Date>();
  const [transactionsEndDate, setTransactionsEndDate] = useState<Date>();

  const [transactionsSort, setTransactionsSort] = useState<{
    field: TransactionSortField;
    order: SortOrder;
  }>({
    field: 'date',
    order: 'desc',
  });

  const { data: transactions, isFetching: isTransactionsFetching } =
    api.transactions.getAll.useQuery(
      {
        endDate: transactionsEndDate,
        startDate: transactionsStartDate,
        sort: `${transactionsSort.field}:${transactionsSort.order}`,
      },
      {
        placeholderData: initialTransactions,
        keepPreviousData: true,
        queryKey: [
          'transactions.getAll',
          { startDate: transactionsStartDate, endDate: transactionsEndDate },
        ],
      },
    );

  const { mutate: apiDeleteTransaction } =
    api.transactions.delete.useMutation();
  const { mutate: apiDeleteManyTransactions } =
    api.transactions.deleteMany.useMutation();
  const { mutate: apiEditTransaction } = api.transactions.edit.useMutation();
  const { mutate: apiDuplicateTransaction } =
    api.transactions.duplicate.useMutation();

  const [transactionToDeleteId, setTransactionToDeleteId] = useState<number>();

  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');

  const handleRefetchTransactionsGetAllQueries = useCallback(
    () =>
      queryClient.refetchQueries({
        queryKey: getQueryKey(api.transactions.getAll),
      }),
    [queryClient],
  );

  const makeHandleDeleteTransaction = (transactionId: number) => () => {
    setTransactionToDeleteId(transactionId);

    apiDeleteTransaction(
      {
        transactionId,
      },
      {
        onSuccess: () => {
          toast('Transaction has been deleted.', {
            type: 'success',
          });

          handleRefetchTransactionsGetAllQueries();
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

              handleRefetchTransactionsGetAllQueries();
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
      [
        apiDeleteManyTransactions,
        loadingToast,
        handleRefetchTransactionsGetAllQueries,
      ],
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

          handleRefetchTransactionsGetAllQueries();
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

  const handleEditTransaction: TransactionTableProps['handleSubmitEditTransaction'] =
    useCallback(
      ({ newValues, transactionId }) => {
        const toastId = loadingToast.showLoading('Editing transaction...');

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
              loadingToast.handleSuccess({
                toastId,
                message: 'Transactions successfully changed.',
              });

              handleRefetchTransactionsGetAllQueries();
            },
            onError: () => {
              loadingToast.handleError({
                toastId,
                message: 'Transaction editing error. Try again.',
              });
            },
          },
        );
      },
      [
        apiEditTransaction,
        handleRefetchTransactionsGetAllQueries,
        loadingToast,
      ],
    );

  const handleChangeTransactionSearchQuery = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setTransactionSearchQuery(event.target.value),
    [],
  );

  const handleChangeTransactionsStartDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setTransactionsStartDate(
        event.target.value ? parseISO(event.target.value) : undefined,
      ),
    [],
  );

  const handleChangeTransactionsEndDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setTransactionsEndDate(
        event.target.value ? parseISO(event.target.value) : undefined,
      ),
    [],
  );

  const searchedTransactions = useMemo(
    () =>
      transactionSearchQuery
        ? transactions?.data.filter(({ bankName, sourceName }) => {
            const searchQueryRegExp = new RegExp(transactionSearchQuery, 'ig');

            return (
              bankName?.match(searchQueryRegExp) ??
              sourceName?.match(searchQueryRegExp)
            );
          })
        : transactions?.data,
    [transactionSearchQuery, transactions],
  );

  const handleSortTransactions = useCallback(
    (field: TransactionSortField, order: SortOrder) => {
      setTransactionsSort({
        field,
        order,
      });
    },
    [],
  );

  if (!me) {
    return <GoogleSignInButton />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-3 sm:gap-x-16">
        <AddNewTransactionForm
          handleSuccessSubmit={handleRefetchTransactionsGetAllQueries}
        />

        <div className="col-span-2">
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
                  className={classNames(
                    'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-auto sm:text-sm sm:leading-6',
                    transactionsStartDate ? 'text-gray-900' : 'text-gray-400',
                  )}
                  placeholder="Start date"
                  value={
                    transactionsStartDate
                      ? formatISO(transactionsStartDate, {
                          representation: 'date',
                        })
                      : ''
                  }
                  onChange={handleChangeTransactionsStartDate}
                />
              </div>

              <div>
                <label htmlFor="transactionSearchQuery">End date</label>

                <input
                  type="date"
                  name="transactionsSEndDate"
                  id="transactionsSEndDate"
                  className={classNames(
                    'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-auto sm:text-sm sm:leading-6',
                    transactionsEndDate ? 'text-gray-900' : 'text-gray-400',
                  )}
                  placeholder="End date"
                  value={
                    transactionsEndDate
                      ? formatISO(transactionsEndDate, {
                          representation: 'date',
                        })
                      : ''
                  }
                  onChange={handleChangeTransactionsEndDate}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              role="status"
              className={twMerge(
                classNames(
                  'invisible absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2',
                  isTransactionsFetching && 'visible',
                ),
              )}
            >
              <svg
                aria-hidden="true"
                className="h-8 w-8 animate-spin fill-blue-600 text-gray-200"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>

            <div
              className={classNames(
                'relative max-h-[calc(100vh/3)] overflow-y-auto',
                isTransactionsFetching && 'pointer-events-none opacity-50',
              )}
            >
              <TransactionTable
                transactions={searchedTransactions}
                handleDeleteAllTransactions={handleDeleteAllTransactions}
                makeHandleDeleteTransaction={makeHandleDeleteTransaction}
                makeHandleDuplicateTransaction={makeHandleDuplicateTransaction}
                transactionToDeleteId={transactionToDeleteId}
                handleSubmitEditTransaction={handleEditTransaction}
                sort={transactionsSort}
                handleSortTransactions={handleSortTransactions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
