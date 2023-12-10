'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Transaction } from '@/shared/types/transactionTypes';
import { EditTransactionModalContent } from './ui/EditTransactionModalContent';

type EditTransactionModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  transaction: Transaction | null;
};

export const EditTransactionModal = ({
  handleClose,
  isModalOpen,
  transaction,
}: EditTransactionModalProps) => {
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
            <div>
              {transaction && (
                <EditTransactionModalContent
                  handleClose={handleClose}
                  transaction={transaction}
                />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
