'use client';

import { FormEvent, Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { classNames } from '@/shared/utils/helpers';
import { XMarkIcon } from '@/shared/icons/XMarkIcon';
import { InputWrapper } from '@/shared/ui/InputWrapper';
import { Input } from '@/shared/ui/Input';
import { DollarInput } from '@/shared/ui/DollarInput';
import { Transaction } from '@/shared/types/transactionTypes';

type EditTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  handleSubmit: (transaction: Transaction) => Promise<void> | undefined | void;
  transaction: Transaction | null;
};

export const EditTransactionModal = ({
  handleClose,
  isModalOpen,
  handleSubmit: propsHandleSubmit,
  transaction,
}: EditTransactionModalProps) => {
  const [transactionValues, setTransactionValues] = useState(transaction);

  const handleSubmit = () => {
    if (!transactionValues) {
      return;
    }

    propsHandleSubmit(transactionValues)?.then(() => {
      handleClose();
    });
  };

  return (
    <Transition show={Boolean(isModalOpen && transaction)} as={Fragment}>
      <Dialog onClose={handleClose} as="div" className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-black/30 sm:block" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
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
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputWrapper label="Date" htmlFor="date">
                    <Input
                      required
                      type="date"
                      name="date"
                      id="date"
                      placeholder="Date"
                    />
                  </InputWrapper>

                  <InputWrapper label="Amount" htmlFor="amount">
                    <DollarInput
                      required
                      name="amount"
                      id="amount"
                      min={0}
                      placeholder="Amount"
                      value={null}
                    />
                  </InputWrapper>

                  <InputWrapper label="Bank Name" htmlFor="bankName">
                    <Input
                      type="text"
                      name="bankName"
                      id="bankName"
                      placeholder="Bank Name"
                    />
                  </InputWrapper>

                  <InputWrapper label="Source Name" htmlFor="sourceName">
                    <Input
                      type="text"
                      name="sourceName"
                      id="sourceName"
                      placeholder="Source Name"
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
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
