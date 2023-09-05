import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { formatISO, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

import { NewTransactionFormValues } from '@/features/AddNewTransactionForm/utils/addNewTransactionFormTypes';
import { api } from '@/shared/api';
import { DollarInput } from '@/shared/ui';

type AddNewTransactionFormProps = {
  handleSuccessSubmit?: () => void;
};

export const AddNewTransactionForm = ({
  handleSuccessSubmit,
}: AddNewTransactionFormProps) => {
  const [newTransactionFormValues, setNewTransactionFormValues] =
    useState<NewTransactionFormValues>({
      date: formatISO(new Date(), { representation: 'date' }),
      amount: null,
      bankName: undefined,
      sourceName: undefined,
    });

  const {
    mutate: apiCreateNewTransaction,
    isLoading: isCreateNewTransactionLoading,
  } = api.transactions.create.useMutation();

  const makeHandleChangeNewTransactionFormValues =
    <TFieldKey extends keyof Omit<NewTransactionFormValues, 'amount'>>(
      field: TFieldKey,
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target
        .value as NewTransactionFormValues[TFieldKey];

      setNewTransactionFormValues((prevFormValues) => ({
        ...prevFormValues,
        [field]: newValue,
      }));
    };

  const handleChangeTransactionAmount = useCallback((value: number) => {
    setNewTransactionFormValues((prevFormValues) => ({
      ...prevFormValues,
      amount: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (newTransactionFormValues.amount === 0) {
        toast.warning('Amount must be greater than 0.', {
          autoClose: 2500,
        });

        return;
      }

      apiCreateNewTransaction(
        {
          ...newTransactionFormValues,
          amount: newTransactionFormValues.amount ?? 0,
          date: parseISO(newTransactionFormValues.date),
        },
        {
          onSuccess: () => {
            toast('New transactions has been added.', {
              type: 'success',
            });

            setNewTransactionFormValues({
              amount: 0,
              date: formatISO(new Date(), { representation: 'date' }),
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

  const handleUploadCSV = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (file && file.type !== 'text/csv') {
        toast.error('Only CSV files are allowed.');

        return;
      }

      const formData = new FormData();
      formData.append('csv', file);

      fetch('/api/transactions/upload-csv', { method: 'POST', body: formData })
        .then((res) => {
          res.json();
        })
        .then(() => {
          handleSuccessSubmit?.();
        });
    },
    [handleSuccessSubmit],
  );

  return (
    <div className="mb-16">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <span className="font-bold text-lg">Add New Transaction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
            <DollarInput
              required
              name="amount"
              id="amount"
              min={0}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Amount"
              value={newTransactionFormValues.amount}
              handleValueChange={handleChangeTransactionAmount}
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
              value={newTransactionFormValues.bankName ?? ''}
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
              value={newTransactionFormValues.sourceName ?? ''}
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

      <p className="mb-4">OR</p>

      <div>
        <label
          htmlFor="uploadTransactionsCSV"
          className="cursor-pointer rounded-md bg-white py-1 px-2 text-md font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Upload CSV
        </label>
        <input
          onChange={handleUploadCSV}
          type="file"
          id="uploadTransactionsCSV"
          accept=".csv"
          hidden
        />
      </div>
    </div>
  );
};
