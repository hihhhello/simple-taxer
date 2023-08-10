import { format } from 'date-fns';

import { RouterOutputs, classNames } from '@/shared/utils';

type TransactionTableProps = {
  transactions: RouterOutputs['transactions']['getAll'];
  transactionToDeleteId?: number;
  makeHandleDeleteTransaction?: (transactionId: number) => () => void;
};

export const TransactionTable = ({
  transactions,
  transactionToDeleteId,
  makeHandleDeleteTransaction,
}: TransactionTableProps) => {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
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

                {makeHandleDeleteTransaction && (
                  <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={classNames(
                    transactionToDeleteId === transaction.id &&
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
