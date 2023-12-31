import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@/shared/icons/XMarkIcon';
import { InputWrapper } from '@/shared/ui/InputWrapper';
import { Input } from '@/shared/ui/Input';
import { DollarInput } from '@/shared/ui/DollarInput';
import { Transaction } from '@/shared/types/transactionTypes';
import { formatISO, parseISO } from 'date-fns';
import { api } from '@/shared/api';
import { useLoadingToast } from '@/shared/utils/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

type TransactionEditFields = {
  amount: number;
  bankName: string | null;
  sourceName: string | null;
  date: string;
};

type EditTransactionModalContentProps = {
  transaction: Transaction;
  handleClose: () => void;
};

export const EditTransactionModalContent = ({
  handleClose,
  transaction,
}: EditTransactionModalContentProps) => {
  const loadingToast = useLoadingToast();
  const queryClient = useQueryClient();

  const { mutate: apiEditTransaction } = api.transactions.edit.useMutation();

  const [transactionValues, setTransactionValues] =
    useState<TransactionEditFields>(getInitialTransactionValues(transaction));

  useEffect(() => {
    setTransactionValues(getInitialTransactionValues(transaction));
  }, [transaction]);

  const handleSubmit = () => {
    const toastId = loadingToast.showLoading('Editing transaction...');

    apiEditTransaction(
      {
        newValues: {
          ...transaction,
          ...transactionValues,
          date: parseISO(transactionValues.date),
        },
        transactionId: transaction.id,
      },
      {
        onSuccess: () => {
          loadingToast.handleSuccess({
            toastId,
            message: 'Transactions successfully changed.',
          });

          queryClient.refetchQueries({
            queryKey: getQueryKey(api.transactions.getAll),
          });
          handleClose();
        },
        onError: () => {
          loadingToast.handleError({
            toastId,
            message: 'Transaction editing error. Try again.',
          });
        },
      },
    );
  };

  return (
    <Dialog.Panel className="relative flex h-full w-full flex-col bg-white sm:max-h-[300px] sm:max-w-xl sm:rounded">
      <div className="z-10 border-b-2 p-4">
        <div className="align-center flex justify-between">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Edit transaction
          </Dialog.Title>

          <button onClick={handleClose}>
            <XMarkIcon />
          </button>
        </div>
      </div>

      <div className="h-full overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <InputWrapper label="Date" htmlFor="date">
            <Input
              required
              type="date"
              name="date"
              id="date"
              placeholder="Date"
              value={transactionValues?.date}
              onChange={(e) =>
                setTransactionValues((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />
          </InputWrapper>

          <InputWrapper label="Amount" htmlFor="amount">
            <DollarInput
              required
              name="amount"
              id="amount"
              min={0}
              placeholder="Amount"
              value={transactionValues?.amount ?? null}
            />
          </InputWrapper>

          <InputWrapper label="Bank Name" htmlFor="bankName">
            <Input
              type="text"
              name="bankName"
              id="bankName"
              placeholder="Bank Name"
              value={transactionValues?.bankName ?? ''}
            />
          </InputWrapper>

          <InputWrapper label="Source Name" htmlFor="sourceName">
            <Input
              type="text"
              name="sourceName"
              id="sourceName"
              placeholder="Source Name"
              value={transactionValues?.sourceName ?? ''}
            />
          </InputWrapper>
        </div>
      </div>

      <div className="z-10 border-t-2 p-4">
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full rounded-full bg-primary-blue py-3 leading-tight text-white"
        >
          {false ? 'Loading...' : 'Edit'}
        </button>
      </div>
    </Dialog.Panel>
  );
};

const getInitialTransactionValues = (
  transaction: Transaction,
): TransactionEditFields => ({
  amount: transaction.amount,
  bankName: transaction.bankName,
  date: formatISO(transaction.date, { representation: 'date' }),
  sourceName: transaction.sourceName,
});
