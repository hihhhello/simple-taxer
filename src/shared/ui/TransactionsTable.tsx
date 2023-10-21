import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { format, formatISO } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

import { classNames, formatToUSDCurrency } from '@/shared/utils';
import {
  Transaction,
  TransactionSortField,
} from '@/shared/types/transactionTypes';
import { DollarInput } from '@/shared/ui/DollarInput';
import { SortOrder } from '../types/types';

type EditTransactionValues = Partial<
  Omit<Transaction, 'id' | 'date'> & { date: string }
>;

export type TransactionTableProps = {
  transactions?: Transaction[];
  transactionToDeleteId?: number;
  makeHandleDeleteTransaction: (transactionId: number) => () => void;
  makeHandleDuplicateTransaction: (transactionId: number) => () => void;
  handleDeleteAllTransactions: (
    transactionIds: number[],
    setSelectedTransactions: Dispatch<SetStateAction<Transaction[]>>,
  ) => void;
  handleSubmitEditTransaction: (params: {
    transactionId: number;
    newValues: EditTransactionValues;
  }) => void;
  handleSortTransactions?: (
    field: TransactionSortField,
    order: SortOrder,
  ) => void;
  sort?: {
    field: TransactionSortField;
    order: SortOrder;
  };
};

export const TransactionTable = ({
  transactions,
  transactionToDeleteId,
  makeHandleDeleteTransaction,
  makeHandleDuplicateTransaction,
  handleDeleteAllTransactions: propsHandleDeleteAllTransactions,
  handleSubmitEditTransaction: propsHandleSubmitEditTransaction,
  sort,
  handleSortTransactions,
}: TransactionTableProps) => {
  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);
  const [transactionToEditId, setTransactionToEditId] = useState<number | null>(
    null,
  );
  const [transactionToEditValues, setTransactionToEditValues] =
    useState<EditTransactionValues | null>(null);

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

  const areTransactionsEmpty = (transactions?.length ?? 0) === 0;

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedTransactions.length > 0 &&
      selectedTransactions.length < (transactions?.length ?? 0);

    setIsBulkCheckboxChecked(
      selectedTransactions.length === transactions?.length &&
        !areTransactionsEmpty,
    );

    setIsBulkCheckboxIndeterminate(isIndeterminate);

    if (bulkCheckboxRef.current) {
      bulkCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [areTransactionsEmpty, selectedTransactions, transactions?.length]);

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

  const makeHandleSelectTransactionToEdit = (transactionId: number) => () =>
    setTransactionToEditId(transactionId);

  const handleCancelTransactionEdit = useCallback(
    () => setTransactionToEditId(null),
    [],
  );

  const handleSubmitEditTransaction = useCallback(() => {
    if (!transactionToEditId || !transactionToEditValues) {
      return;
    }

    propsHandleSubmitEditTransaction({
      transactionId: transactionToEditId,
      newValues: transactionToEditValues,
    });
    setTransactionToEditId(null);
    setTransactionToEditValues(null);
  }, [
    propsHandleSubmitEditTransaction,
    transactionToEditId,
    transactionToEditValues,
  ]);

  const makeHandleChangeTransactionToEditValues =
    (fieldKey: keyof Omit<Transaction, 'id'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setTransactionToEditValues((prevTransactionValues) => ({
        ...prevTransactionValues,
        [fieldKey]: event.target.value,
      }));
    };

  const handleChangeTransactionToEditAmount = useCallback(
    (value: number) =>
      setTransactionToEditValues((prevTransactionValues) => ({
        ...prevTransactionValues,
        amount: value,
      })),
    [],
  );

  useEffect(() => {
    const transactionEditingEventListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelTransactionEdit();

        return;
      }

      if (event.key === 'Enter') {
        handleSubmitEditTransaction();
      }
    };

    document.addEventListener('keydown', transactionEditingEventListener);

    return () =>
      document.removeEventListener('keydown', transactionEditingEventListener);
  }, [handleCancelTransactionEdit, handleSubmitEditTransaction]);

  const makeHandleSortTransaction = (field: 'amount' | 'date') => () => {
    if (!sort || !handleSortTransactions) {
      return;
    }

    const newSortOrder =
      sort.field === field ? (sort.order === 'asc' ? 'desc' : 'asc') : 'asc';

    handleSortTransactions(field, newSortOrder);
  };

  return (
    <div className="relative">
      <table className="relative min-w-full divide-y divide-gray-300">
        <thead className="sticky top-0 z-10 bg-white">
          {selectedTransactions.length > 0 && (
            <div className="absolute left-14 top-0 z-20 flex h-12 items-center space-x-3 bg-white sm:left-12">
              <button
                onClick={handleDeleteAllTransactions}
                type="button"
                className="inline-flex items-center rounded bg-white px-4 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              >
                Delete all
              </button>
            </div>
          )}

          <tr>
            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
              <input
                disabled={areTransactionsEmpty}
                ref={bulkCheckboxRef}
                type="checkbox"
                className={classNames(
                  'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600',
                  areTransactionsEmpty
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                )}
                checked={isBulkCheckboxChecked}
                onChange={handleToggleAllSelectedTransactions}
              />
            </th>

            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              Id
            </th>

            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <div
                className="flex cursor-pointer items-center"
                onClick={makeHandleSortTransaction('date')}
              >
                Date{' '}
                {sort?.field === 'date' ? (
                  sort.order === 'desc' ? (
                    <>&#x25BC;</>
                  ) : (
                    <>&#x25B2;</>
                  )
                ) : (
                  <>&#x25BC;</>
                )}
              </div>
            </th>

            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <div
                className="flex cursor-pointer items-center"
                onClick={makeHandleSortTransaction('amount')}
              >
                Amount{' '}
                {sort?.field === 'amount' ? (
                  sort.order === 'desc' ? (
                    <>&#x25BC;</>
                  ) : (
                    <>&#x25B2;</>
                  )
                ) : (
                  <>&#x25BC;</>
                )}
              </div>
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

            <th scope="col" className="py-3.5 pl-3 pr-4">
              <span className="sr-only">Delete</span>
            </th>
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

                {transactionToEditId === transaction.id ? (
                  <>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>

                    <td className="whitespace-nowrap text-gray-500">
                      <input
                        value={
                          transactionToEditValues?.date ??
                          formatISO(transaction.date, {
                            representation: 'date',
                          })
                        }
                        onChange={makeHandleChangeTransactionToEditValues(
                          'date',
                        )}
                        type="date"
                        className="px-3 py-4 text-sm"
                      />
                    </td>

                    <td className="whitespace-nowrap text-gray-500">
                      <DollarInput
                        value={
                          transactionToEditValues?.amount ??
                          transaction.amount ??
                          ''
                        }
                        handleValueChange={handleChangeTransactionToEditAmount}
                        className="px-3 py-4 text-sm"
                      />
                    </td>

                    <td className="whitespace-nowrap text-gray-500">
                      <input
                        value={
                          transactionToEditValues?.bankName ??
                          transaction.bankName ??
                          ''
                        }
                        placeholder="Bank name"
                        className="px-3 py-4 text-sm"
                        onChange={makeHandleChangeTransactionToEditValues(
                          'bankName',
                        )}
                      />
                    </td>

                    <td className="whitespace-nowrap text-gray-500">
                      <input
                        value={
                          transactionToEditValues?.sourceName ??
                          transaction.sourceName ??
                          ''
                        }
                        placeholder="Source name"
                        className="px-3 py-4 text-sm"
                        onChange={makeHandleChangeTransactionToEditValues(
                          'sourceName',
                        )}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(transaction.date, 'MM-dd-yyyy')}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatToUSDCurrency(transaction.amount)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaction.bankName ?? '--'}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaction.sourceName ?? '--'}
                    </td>
                  </>
                )}

                <td className="whitespace-nowrap px-3 py-4 pr-4 text-sm text-gray-500">
                  <div className="flex justify-end gap-2">
                    {transactionToEditId === transaction.id && (
                      <XCircleIcon
                        className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-900"
                        onClick={handleCancelTransactionEdit}
                      />
                    )}

                    {transactionToEditId === transaction.id ? (
                      <CheckCircleIcon
                        className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-900"
                        onClick={handleSubmitEditTransaction}
                      />
                    ) : (
                      <PencilIcon
                        className="h-5 w-5 cursor-pointer text-indigo-600 hover:text-indigo-900"
                        onClick={makeHandleSelectTransactionToEdit(
                          transaction.id,
                        )}
                      />
                    )}

                    <DocumentDuplicateIcon
                      onClick={makeHandleDuplicateTransaction(transaction.id)}
                      className="h-5 w-5 cursor-pointer hover:text-gray-600"
                    />

                    <TrashIcon
                      onClick={makeHandleDeleteTransaction(transaction.id)}
                      className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-900"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
