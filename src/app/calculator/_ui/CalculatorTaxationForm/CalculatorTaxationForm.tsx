import { ChangeEvent, useCallback, useState } from 'react';
import { User } from 'next-auth';

import { DollarInput } from '@/shared/ui/DollarInput';
import {
  IncomeTaxCalculatorFilingStatus,
  IncomeTaxCalculatorFilingStatusKey,
  IncomeTaxCalculatorUSState,
} from './utils/calculatorTaxationFormTypes';
import {
  INCOME_TAX_CALCULATOR_US_STATES_KEYS,
  INCOME_TAX_CALCULATOR_US_STATE_KEY_TO_NAME,
} from './utils/calculatorTaxationFormConstants';

export type CalculatorTaxationFormProps = {
  totalIncome: number | undefined;
  me: User | undefined | null;
  handleCalculateTaxes: (params: {
    householdIncome: number;
    filingStatus: IncomeTaxCalculatorFilingStatus;
    taxStateKey: IncomeTaxCalculatorUSState;
  }) => void;
};

export const CalculatorTaxationForm = ({
  totalIncome,
  me,
  handleCalculateTaxes,
}: CalculatorTaxationFormProps) => {
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
    <div className="w-full">
      <div className="mb-4">
        <div className="relative rounded-2xl bg-white px-4 py-2">
          <div className="mb-1">
            <label
              htmlFor="name"
              className="rounded-md bg-primary-green px-4 py-1 text-xs font-medium text-white sm:text-sm"
            >
              Household Income
            </label>
          </div>

          <DollarInput
            name="householdIncome"
            id="householdIncome"
            placeholder="$00.00"
            className="w-full border-none text-3xl font-light sm:text-6xl"
            handleValueChange={setHouseholdIncome}
            value={householdIncome}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div className="flex flex-1 items-end gap-6">
          <div className="flex-1">
            <div className="mb-1">
              <label
                htmlFor="filingStatus"
                className="rounded-md bg-primary-green px-4 py-1 text-xs font-medium text-white sm:text-sm"
              >
                Filing Status
              </label>
            </div>

            <select
              id="filingStatus"
              name="filingStatus"
              className="w-full rounded-xl border-none bg-white text-sm sm:min-w-[200px] sm:max-w-[250px] sm:text-base"
              value={filingStatus}
              onChange={handleChangeFilingStatus}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div className="flex-1">
            <div className="mb-1">
              <label
                htmlFor="taxState"
                className="rounded-md bg-primary-green px-4 py-1 text-xs font-medium text-white sm:text-sm"
              >
                State
              </label>
            </div>

            <select
              id="taxState"
              name="taxState"
              className="w-full rounded-xl border-none bg-white text-sm sm:min-w-[200px] sm:max-w-[250px] sm:text-base"
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

        <div className="w-full sm:w-auto">
          <button
            className="w-full rounded-full bg-primary-blue px-8 py-4 leading-none text-white sm:w-auto"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};
