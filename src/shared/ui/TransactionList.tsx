import { Fragment } from 'react';
import { format } from 'date-fns';
import { PencilIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Transaction } from '@/shared/types/transactionTypes';
import { ThreeDotsVerticalIcon } from '@/shared/icons/ThreeDotsVerticalIcon';
import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';

type TransactionListProps = {
  transactions: Transaction[] | undefined;
  transactionToDeleteId?: number;
  makeHandleDeleteTransaction: (transactionId: number) => () => void;
  makeHandleDuplicateTransaction: (transactionId: number) => () => void;
  handleEdit: (transaction: Transaction) => void;
};

export const TransactionList = ({
  transactions,
  makeHandleDeleteTransaction,
  makeHandleDuplicateTransaction,
  transactionToDeleteId,
  handleEdit,
}: TransactionListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {transactions?.map((transaction) => (
        <div
          key={transaction.id}
          className="flex flex-col rounded-md bg-white p-2"
        >
          <div className="align-center flex justify-between">
            <div>
              <span>#{transaction.id}</span>

              <span className="ml-2">{transaction.sourceName}</span>
            </div>

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
                    <Menu.Items className="absolute left-0 top-0 z-10 w-[115px] origin-top-right -translate-x-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleEdit(transaction)}
                            className={classNames(
                              'flex w-full items-center gap-2 rounded-t-md px-4 py-2',
                              active && 'bg-primary-background-blue',
                            )}
                          >
                            <PencilIcon
                              className={classNames(
                                'h-5 w-5 text-primary-gray',
                                active && 'text-primary-light-blue',
                              )}
                            />

                            <span
                              className={classNames(
                                'h-5 w-5 text-primary-gray',
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
                                'h-5 w-5 text-primary-gray',
                                active && 'text-primary-light-blue',
                              )}
                            />

                            <span
                              className={classNames(
                                'h-5 w-5 text-primary-gray',
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
                                'h-5 w-5 text-primary-gray',
                                active && 'text-red-600',
                              )}
                            />

                            <span
                              className={classNames(
                                'h-5 w-5 text-primary-gray',
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
          </div>

          <div className="mb-1">
            <span className="font-bold">
              {formatUSDDecimal(transaction.amount)}
            </span>
          </div>

          <div className="align-center flex justify-between">
            <span>{format(transaction.date, 'MM/dd/yyyy')}</span>

            <span>{transaction.bankName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
