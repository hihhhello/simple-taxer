import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { formatISO, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

import { NewTransactionFormValues } from '@/features/AddNewTransactionForm/utils/addNewTransactionFormTypes';
import { api } from '@/shared/api';
import { DollarInput } from '@/shared/ui/DollarInput';
import { InputWrapper } from '@/shared/ui/InputWrapper';
import { Input } from '@/shared/ui/Input';

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

      fetch('/api/transactions/upload-csv', {
        method: 'POST',
        body: formData,
      }).then(() => {
        handleSuccessSubmit?.();
      });
    },
    [handleSuccessSubmit],
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4 rounded-lg bg-white p-4">
          <span className="text-2xl font-bold text-primary-blue">
            Add New Transaction
          </span>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWrapper label="Date" htmlFor="date">
            <Input
              required
              type="date"
              name="date"
              id="date"
              placeholder="Date"
              value={newTransactionFormValues.date}
              onChange={makeHandleChangeNewTransactionFormValues('date')}
            />
          </InputWrapper>

          <InputWrapper label="Amount" htmlFor="amount">
            <DollarInput
              required
              name="amount"
              id="amount"
              min={0}
              placeholder="Amount"
              value={newTransactionFormValues.amount}
              handleValueChange={handleChangeTransactionAmount}
            />
          </InputWrapper>

          <InputWrapper label="Bank Name" htmlFor="bankName">
            <Input
              type="text"
              name="bankName"
              id="bankName"
              placeholder="Bank Name"
              value={newTransactionFormValues.bankName ?? ''}
              onChange={makeHandleChangeNewTransactionFormValues('bankName')}
            />
          </InputWrapper>

          <InputWrapper label="Source Name" htmlFor="sourceName">
            <Input
              type="text"
              name="sourceName"
              id="sourceName"
              placeholder="Source Name"
              value={newTransactionFormValues.sourceName ?? ''}
              onChange={makeHandleChangeNewTransactionFormValues('sourceName')}
            />
          </InputWrapper>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary-blue py-3 leading-tight text-white"
        >
          {isCreateNewTransactionLoading ? 'Loading...' : 'Add'}
        </button>
      </form>

      <p className="mb-4 text-center text-primary-blue">or</p>

      <div className="w-full">
        <label
          htmlFor="uploadTransactionsCSV"
          className="block w-full rounded-full border border-primary-blue bg-white py-3 text-center leading-tight text-primary-blue"
          tabIndex={0}
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
