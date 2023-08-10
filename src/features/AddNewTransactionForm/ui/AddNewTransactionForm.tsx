import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { parseISO } from 'date-fns';
import { toast } from 'react-toastify';

import { NewTransactionFormValues } from '@/features/AddNewTransactionForm/utils/addNewTransactionFormTypes';
import { api } from '@/shared/api';

type AddNewTransactionFormProps = {
  handleSuccessSubmit?: () => void;
};

export const AddNewTransactionForm = ({
  handleSuccessSubmit,
}: AddNewTransactionFormProps) => {
  const [newTransactionFormValues, setNewTransactionFormValues] =
    useState<NewTransactionFormValues>({
      date: '',
      amount: 0,
      bankName: undefined,
      sourceName: undefined,
    });

  const {
    mutate: apiCreateNewTransaction,
    isLoading: isCreateNewTransactionLoading,
  } = api.transactions.create.useMutation();

  const makeHandleChangeNewTransactionFormValues =
    <TFieldKey extends keyof NewTransactionFormValues>(field: TFieldKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target
        .value as NewTransactionFormValues[TFieldKey];

      setNewTransactionFormValues((prevFormValues) => ({
        ...prevFormValues,
        [field]: newValue,
      }));
    };

  const handleSubmit = useCallback(
    (e: FormEvent) => {
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

            handleSuccessSubmit?.();
          },
        },
      );
    },
    [apiCreateNewTransaction, handleSuccessSubmit, newTransactionFormValues],
  );

  return (
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
              onChange={makeHandleChangeNewTransactionFormValues('date')}
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
              onChange={makeHandleChangeNewTransactionFormValues('amount')}
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
              onChange={makeHandleChangeNewTransactionFormValues('bankName')}
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
              onChange={makeHandleChangeNewTransactionFormValues('sourceName')}
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
  );
};
