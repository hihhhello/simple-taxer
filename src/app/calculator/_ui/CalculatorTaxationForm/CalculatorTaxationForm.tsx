import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
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
import { InputWrapper } from '@/shared/ui/InputWrapper';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';

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

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();

    if (!householdIncome || !taxStateKey) {
      return;
    }

    handleCalculateTaxes({ filingStatus, householdIncome, taxStateKey });
  };

  return (
    <form onSubmit={handleCalculate} className="w-full">
      <div className="mb-4">
        <div className="relative rounded-2xl bg-white px-4 py-2">
          <InputWrapper label="Household Income" htmlFor="householdIncome">
            <DollarInput
              required
              name="householdIncome"
              id="householdIncome"
              placeholder="$00.00"
              className="w-full border-none text-3xl font-light shadow-none sm:text-6xl"
              handleValueChange={setHouseholdIncome}
              value={householdIncome}
            />
          </InputWrapper>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div className="flex flex-1 items-end gap-6">
          <div className="flex-1">
            <InputWrapper label="Filing Status" htmlFor="filingStatus">
              <Select
                id="filingStatus"
                name="filingStatus"
                className="sm:min-w-[200px] sm:max-w-[250px]"
                value={filingStatus}
                onChange={handleChangeFilingStatus}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
              </Select>
            </InputWrapper>
          </div>

          <div className="flex-1">
            <InputWrapper label="State" htmlFor="taxState">
              <Select
                required
                id="taxState"
                name="taxState"
                className="sm:min-w-[200px] sm:max-w-[250px]"
                value={taxStateKey ?? ''}
                onChange={handleChangeTaxState}
              >
                <option value="">Select state</option>

                {INCOME_TAX_CALCULATOR_US_STATES_KEYS.map((stateKey) => (
                  <option key={stateKey} value={stateKey}>
                    {INCOME_TAX_CALCULATOR_US_STATE_KEY_TO_NAME[stateKey]}
                  </option>
                ))}
              </Select>
            </InputWrapper>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            className="w-full rounded-full bg-primary-blue px-8 py-4 leading-none text-white sm:w-auto"
            type="submit"
          >
            Calculate
          </Button>
        </div>
      </div>
    </form>
  );
};
