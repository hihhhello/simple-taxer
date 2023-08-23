import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { format } from 'date-fns';

import { classNames } from '@/shared/utils';
import { Transaction } from '@/shared/types';

export type TransactionTableProps = {
  transactions?: Transaction[];
  transactionToDeleteId?: number;
  makeHandleDeleteTransaction?: (transactionId: number) => () => void;
  handleDeleteAllTransactions: (
    transactionIds: number[],
    setSelectedTransactions: Dispatch<SetStateAction<Transaction[]>>,
  ) => void;
};

export const TransactionTable = ({
  transactions,
  transactionToDeleteId,
  makeHandleDeleteTransaction,
  handleDeleteAllTransactions: propsHandleDeleteAllTransactions,
}: TransactionTableProps) => {
  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);

  const makeHandleSelectTransaction =
    (transaction: Transaction) => (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedTransactions((prevSelectedTransactions) => {
        if (e.target.checked) {
          return [...prevSelectedTransactions, transaction];
        }

        return prevSelectedTransactions.filter(
          (selectedTransaction) => selectedTransaction.id !== transaction.id,
        );
      });
    };

  const bulkCheckboxRef = useRef<HTMLInputElement>(null);
  const [isBulkCheckboxChecked, setIsBulkCheckboxChecked] = useState(false);
  const [isBulkCheckboxIndeterminate, setIsBulkCheckboxIndeterminate] =
    useState(false);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedTransactions.length > 0 &&
      selectedTransactions.length < (transactions?.length ?? 0);

    setIsBulkCheckboxChecked(
      selectedTransactions.length === transactions?.length,
    );

    setIsBulkCheckboxIndeterminate(isIndeterminate);

    if (bulkCheckboxRef.current) {
      bulkCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedTransactions, transactions?.length]);

  const handleToggleAllSelectedTransactions = useCallback(() => {
    setSelectedTransactions(
      isBulkCheckboxChecked || isBulkCheckboxIndeterminate
        ? []
        : transactions ?? [],
    );
    setIsBulkCheckboxChecked(
      !isBulkCheckboxChecked && !isBulkCheckboxIndeterminate,
    );
    setIsBulkCheckboxIndeterminate(false);
  }, [isBulkCheckboxChecked, isBulkCheckboxIndeterminate, transactions]);

  const getIsTransactionSelected = useCallback(
    (transactionId: number) =>
      Boolean(
        selectedTransactions.find(
          (selectedTransaction) => selectedTransaction.id === transactionId,
        ),
      ),
    [selectedTransactions],
  );

  const handleDeleteAllTransactions = useCallback(() => {
    propsHandleDeleteAllTransactions(
      selectedTransactions.map((selectedTransaction) => selectedTransaction.id),
      setSelectedTransactions,
    );
  }, [propsHandleDeleteAllTransactions, selectedTransactions]);

  return (
    <div className="relative">
      <table className="relative min-w-full divide-y divide-gray-300">
        <thead className="sticky bg-white top-0 z-10">
          {selectedTransactions.length > 0 && (
            <div className="absolute left-14 top-0 z-20 flex h-12 items-center space-x-3 bg-white sm:left-12">
              <button
                onClick={handleDeleteAllTransactions}
                type="button"
                className="inline-flex items-center rounded bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              >
                Delete all
              </button>
            </div>
          )}

          <tr>
            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
              <input
                ref={bulkCheckboxRef}
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked={isBulkCheckboxChecked}
                onChange={handleToggleAllSelectedTransactions}
              />
            </th>

            <th
              scope="col"
              className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
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

            {makeHandleDeleteTransaction && (
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Delete</span>
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {transactions?.map((transaction) => {
            const isTransactionSelected = getIsTransactionSelected(
              transaction.id,
            );

            return (
              <tr
                key={transaction.id}
                className={classNames(
                  transactionToDeleteId === transaction.id &&
                    'animate-pulse cursor-not-allowed',
                  isTransactionSelected && 'bg-gray-50',
                )}
              >
                <td className="relative px-7 sm:w-12 sm:px-6">
                  {isTransactionSelected && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                  )}

                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value={transaction.id}
                    checked={isTransactionSelected}
                    onChange={makeHandleSelectTransaction(transaction)}
                  />
                </td>

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

                {makeHandleDeleteTransaction && (
                  <td
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 pr-4 sm:pr-0 cursor-pointer group"
                    onClick={makeHandleDeleteTransaction(transaction.id)}
                  >
                    <span className="text-red-600 group-hover:text-red-900 font-bold">
                      Delete
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
