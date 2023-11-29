import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { format, formatISO } from 'date-fns';
import { PencilIcon } from '@heroicons/react/24/solid';
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';

import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';
import {
  Transaction,
  TransactionSortField,
} from '@/shared/types/transactionTypes';
import { DollarInput } from '@/shared/ui/DollarInput';
import { SortOrder } from '../types/types';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ThreeDotsVerticalIcon } from '../icons/ThreeDotsVerticalIcon';
import { Menu, Transition } from '@headlessui/react';

type EditTransactionValues = Partial<
  Omit<Transaction, 'id' | 'date'> & { date: string }
>;

export type TransactionTableProps = {
  transactions: Transaction[] | undefined;
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
      <table className="relative min-w-full border-separate border-spacing-y-2 divide-y divide-gray-300">
        <thead className="sticky top-0 z-10 bg-primary-background">
          {selectedTransactions.length > 0 && (
            <div className="absolute left-14 top-0 z-20 flex h-12 items-center space-x-3 bg-primary-background sm:left-12">
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
                name="bulkCheckbox"
                className={classNames(
                  'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green',
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
              className="py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-text-dark"
            >
              ID
            </th>

            <th
              scope="col"
              className="focus-primary-green cursor-pointer px-3 py-3.5 text-left text-sm font-semibold text-text-dark"
              onClick={makeHandleSortTransaction('date')}
              tabIndex={0}
            >
              <div className="flex items-center">
                Date{' '}
                {sort?.field === 'date' ? (
                  sort.order === 'desc' ? (
                    <ChevronLeftIcon className="-rotate-90 text-primary-light-blue" />
                  ) : (
                    <ChevronLeftIcon className="rotate-90 text-primary-light-blue" />
                  )
                ) : (
                  <ChevronLeftIcon className="-rotate-90 text-primary-light-blue" />
                )}
              </div>
            </th>

            <th
              scope="col"
              className="focus-primary-green cursor-pointer px-3 py-3.5 text-left text-sm font-semibold text-text-dark"
              onClick={makeHandleSortTransaction('amount')}
              tabIndex={0}
            >
              <div className="flex items-center">
                Amount{' '}
                {sort?.field === 'amount' ? (
                  sort.order === 'desc' ? (
                    <ChevronLeftIcon className="-rotate-90 text-primary-light-blue" />
                  ) : (
                    <ChevronLeftIcon className="rotate-90 text-primary-light-blue" />
                  )
                ) : (
                  <ChevronLeftIcon className="-rotate-90 text-primary-light-blue" />
                )}
              </div>
            </th>

            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-text-dark"
            >
              Bank Name
            </th>

            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-text-dark"
            >
              Source Name
            </th>

            <th scope="col" className="py-3.5 pl-3 pr-4">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions?.map((transaction) => {
            const isTransactionSelected = getIsTransactionSelected(
              transaction.id,
            );

            return (
              <tr
                key={transaction.id}
                className={classNames(
                  'bg-white',
                  transactionToDeleteId === transaction.id &&
                    'animate-pulse cursor-not-allowed',
                  isTransactionSelected && 'bg-gray-50',
                )}
              >
                <td className="relative rounded-l-md px-7 sm:w-12 sm:px-6">
                  {isTransactionSelected && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary-green" />
                  )}

                  <input
                    type="checkbox"
                    name="isTransactionSelected"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                    value={transaction.id}
                    checked={isTransactionSelected}
                    onChange={makeHandleSelectTransaction(transaction)}
                  />
                </td>

                {transactionToEditId === transaction.id ? (
                  <>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-text-regular">
                      {transaction.id}
                    </td>

                    <td className="whitespace-nowrap text-text-regular">
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
                        className="px-3 py-2 text-sm"
                      />
                    </td>

                    <td className="whitespace-nowrap text-text-regular">
                      <DollarInput
                        value={
                          transactionToEditValues?.amount ??
                          transaction.amount ??
                          ''
                        }
                        handleValueChange={handleChangeTransactionToEditAmount}
                        className="px-3 py-2 text-sm"
                      />
                    </td>

                    <td className="whitespace-nowrap text-text-regular">
                      <input
                        value={
                          transactionToEditValues?.bankName ??
                          transaction.bankName ??
                          ''
                        }
                        placeholder="Bank name"
                        className="px-3 py-2 text-sm"
                        onChange={makeHandleChangeTransactionToEditValues(
                          'bankName',
                        )}
                      />
                    </td>

                    <td className="whitespace-nowrap text-text-regular">
                      <input
                        value={
                          transactionToEditValues?.sourceName ??
                          transaction.sourceName ??
                          ''
                        }
                        placeholder="Source name"
                        className="px-3 py-2 text-sm"
                        onChange={makeHandleChangeTransactionToEditValues(
                          'sourceName',
                        )}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm text-text-regular">
                      {transaction.id}
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-sm text-text-regular">
                      {format(transaction.date, 'MM/dd./yyyy')}
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-sm text-text-regular">
                      {formatUSDDecimal(transaction.amount)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-sm text-text-regular">
                      {transaction.bankName ?? '--'}
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-sm text-text-regular">
                      {transaction.sourceName ?? '--'}
                    </td>
                  </>
                )}

                <td className="whitespace-nowrap rounded-r-md px-3 py-2 pr-4 text-sm text-text-regular">
                  <Menu as="div" className="relative ml-3">
                    {({ open }) => (
                      <>
                        <Menu.Button
                          className={classNames(
                            'rounded-md bg-primary-green',
                            open && 'bg-primary-light-blue',
                          )}
                        >
                          <ThreeDotsVerticalIcon className="text-white" />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 top-0 z-10 ml-8 w-[115px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {/* <Menu.Item>
                          {transactionToEditId === transaction.id && (
                            <button onClick={handleCancelTransactionEdit}>
                              <XCircleIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-900" />
                            </button>
                          )}
                        </Menu.Item> */}

                            {/* <Menu.Item>
                          {transactionToEditId === transaction.id ? (
                            <button onClick={handleSubmitEditTransaction}>
                              <CheckCircleIcon className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-900" />
                            </button>
                          ) : (
                            <button
                              onClick={makeHandleSelectTransactionToEdit(
                                transaction.id,
                              )}
                            >
                              <PencilIcon className="h-5 w-5 cursor-pointer text-indigo-600 hover:text-indigo-900" />
                            </button>
                          )}
                        </Menu.Item> */}

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={makeHandleSelectTransactionToEdit(
                                    transaction.id,
                                  )}
                                  className={classNames(
                                    'flex w-full items-center gap-2 rounded-t-md px-4 py-2',
                                    active && 'bg-primary-background-blue',
                                  )}
                                >
                                  <PencilIcon
                                    className={classNames(
                                      'text-primary-gray h-5 w-5',
                                      active && 'text-primary-light-blue',
                                    )}
                                  />

                                  <span
                                    className={classNames(
                                      'text-primary-gray h-5 w-5',
                                      active && 'text-primary-light-blue',
                                    )}
                                  >
                                    Edit
                                  </span>
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={makeHandleDuplicateTransaction(
                                    transaction.id,
                                  )}
                                  className={classNames(
                                    'flex w-full items-center gap-2 px-4 py-2',
                                    active && 'bg-primary-background-blue',
                                  )}
                                >
                                  <DocumentDuplicateIcon
                                    className={classNames(
                                      'text-primary-gray h-5 w-5',
                                      active && 'text-primary-light-blue',
                                    )}
                                  />

                                  <span
                                    className={classNames(
                                      'text-primary-gray h-5 w-5',
                                      active && 'text-primary-light-blue',
                                    )}
                                  >
                                    Copy
                                  </span>
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={makeHandleDeleteTransaction(
                                    transaction.id,
                                  )}
                                  className={classNames(
                                    'flex w-full items-center gap-2 rounded-b-md px-4 py-2',
                                    active && 'bg-red-100',
                                  )}
                                >
                                  <TrashIcon
                                    className={classNames(
                                      'text-primary-gray h-5 w-5',
                                      active && 'text-red-600',
                                    )}
                                  />

                                  <span
                                    className={classNames(
                                      'text-primary-gray h-5 w-5',
                                      active && 'text-red-600',
                                    )}
                                  >
                                    Delete
                                  </span>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
