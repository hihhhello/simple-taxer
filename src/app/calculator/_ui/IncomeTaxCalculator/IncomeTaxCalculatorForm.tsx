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
    <div className="w-full">
      <div className="mb-4">
        <div className="relative rounded-2xl bg-white px-4 py-2">
          <div className="mb-1">
            <label
              htmlFor="name"
              className="rounded-lg bg-primary-green px-4 py-1 text-sm font-medium text-white"
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

      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-1 items-end gap-6">
          <div>
            <div className="mb-1">
              <label
                htmlFor="filingStatus"
                className="rounded-lg bg-primary-green px-4 py-1 text-sm font-medium text-white"
              >
                Filing Status
              </label>
            </div>

            <select
              id="filingStatus"
              name="filingStatus"
              className="min-w-[200px] max-w-[250px] rounded-xl border-none bg-white"
              value={filingStatus}
              onChange={handleChangeFilingStatus}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div>
            <div className="mb-1">
              <label
                htmlFor="taxState"
                className="rounded-lg bg-primary-green px-4 py-1 text-sm font-medium text-white"
              >
                State
              </label>
            </div>

            <select
              id="taxState"
              name="taxState"
              className="min-w-[200px] max-w-[250px] rounded-xl border-none bg-white"
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

        <div>
          <button
            className="rounded-full bg-primary-blue px-8 py-4 leading-none text-white"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};
