import { ChangeEvent, useCallback, useState } from 'react';
import { User } from 'next-auth';

import { DollarInput } from '@/shared/ui/DollarInput';
import {
  IncomeTaxCalculatorFilingStatus,
  IncomeTaxCalculatorFilingStatusKey,
  IncomeTaxCalculatorUSState,
} from './utils/incomeTaxCalculatorTypes';
import {
  INCOME_TAX_CALCULATOR_US_STATES_KEYS,
  INCOME_TAX_CALCULATOR_US_STATE_KEY_TO_NAME,
} from './utils/incomeTaxCalculatorConstants';

export type IncomeTaxCalculatorFormProps = {
  totalIncome: number | undefined;
  me: User | undefined | null;
  handleCalculateTaxes: (params: {
    householdIncome: number;
    filingStatus: IncomeTaxCalculatorFilingStatus;
    taxStateKey: IncomeTaxCalculatorUSState;
  }) => void;
};

export const IncomeTaxCalculatorForm = ({
  totalIncome,
  me,
  handleCalculateTaxes,
}: IncomeTaxCalculatorFormProps) => {
  const [filingStatus, setFilingStatus] =
    useState<IncomeTaxCalculatorFilingStatus>(
      IncomeTaxCalculatorFilingStatusKey.SINGLE,
    );
  const [householdIncome, setHouseholdIncome] = useState<number | null>(null);
  const [taxStateKey, setTaxStateKey] =
    useState<IncomeTaxCalculatorUSState | null>(null);

  const handleUseTotalIncome = useCallback(() => {
    if (!totalIncome) {
      return;
    }

    setHouseholdIncome(totalIncome);
  }, [totalIncome]);

  const handleChangeFilingStatus = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setFilingStatus(event.target.value as IncomeTaxCalculatorFilingStatus);
    },
    [],
  );

  const handleChangeTaxState = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setTaxStateKey(event.target.value as IncomeTaxCalculatorUSState);
    },
    [],
  );

  const handleCalculate = () => {
    if (!householdIncome || !taxStateKey) {
      return;
    }

    handleCalculateTaxes({ filingStatus, householdIncome, taxStateKey });
  };

  return (
    <div>
      <div>
        <div className="relative rounded-2xl bg-white px-4 py-2">
          <div className="mb-1">
            <label
              htmlFor="name"
              className="bg-primary-green rounded-lg px-4 py-1 text-sm font-medium text-white"
            >
              Household Income
            </label>
          </div>

          <DollarInput
            name="householdIncome"
            id="householdIncome"
            placeholder="$00.00"
            className="w-full border-none text-6xl font-light"
            handleValueChange={setHouseholdIncome}
            value={householdIncome}
          />
        </div>
      </div>

      <div></div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto w-full max-w-md">
        <div className="isolate -space-y-px rounded-md shadow-sm">
          <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
            <div className="flex w-full items-center justify-between">
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-900"
              >
                Household Income
              </label>

              {me && totalIncome && (
                <div className="text-sm">
                  <span
                    onClick={handleUseTotalIncome}
                    className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                  >
                    Use total
                  </span>
                </div>
              )}
            </div>

            <DollarInput
              name="householdIncome"
              id="householdIncome"
              placeholder="Household Income"
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              handleValueChange={setHouseholdIncome}
              value={householdIncome}
            />
          </div>

          <div className="flex">
            <div className="relative flex-1 rounded-md rounded-r-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="job-title"
                className="block text-xs font-medium text-gray-900"
              >
                Filing Status
              </label>

              <select
                id="filingStatus"
                name="filingStatus"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={filingStatus}
                onChange={handleChangeFilingStatus}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>

            <div className="relative flex-1 rounded-md rounded-l-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="job-title"
                className="block text-xs font-medium text-gray-900"
              >
                State
              </label>

              <select
                id="taxState"
                name="taxState"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={taxStateKey ?? ''}
                onChange={handleChangeTaxState}
              >
                <option value="">Select state</option>

                {INCOME_TAX_CALCULATOR_US_STATES_KEYS.map((stateKey) => (
                  <option key={stateKey} value={stateKey}>
                    {INCOME_TAX_CALCULATOR_US_STATE_KEY_TO_NAME[stateKey]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleCalculate}>Calculate</button>
    </div>
  );
};
