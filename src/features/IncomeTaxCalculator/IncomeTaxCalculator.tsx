import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { User } from 'next-auth';

import { DollarInput } from '@/shared/ui/DollarInput';
import { formatToUSDCurrency } from '@/shared/utils';
import usIncomeTaxes2023 from '@/shared/data/usIncomeTaxes2023.json';
import {
  calculateFederalTax,
  calculateStateTax,
} from './utils/incomeTaxCalculatorHelpers';
import {
  IncomeTaxCalculatorFilingStatus,
  IncomeTaxCalculatorFilingStatusKey,
  IncomeTaxCalculatorUSState,
} from './utils/incomeTaxCalculatorTypes';
import {
  INCOME_TAX_CALCULATOR_US_STATES_KEYS,
  INCOME_TAX_CALCULATOR_US_STATE_KEY_TO_NAME,
} from './utils/incomeTaxCalculatorConstants';
import { IncomeTaxCalculatorResults } from './ui/IncomeTaxCalculatorResults';

type IncomeTaxCalculatorProps = {
  totalIncome: number | undefined;
  me: User | undefined | null;
};

export const IncomeTaxCalculator = ({
  totalIncome,
  me,
}: IncomeTaxCalculatorProps) => {
  const [filingStatus, setFilingStatus] =
    useState<IncomeTaxCalculatorFilingStatus>(
      IncomeTaxCalculatorFilingStatusKey.SINGLE,
    );
  const [householdIncome, setHouseholdIncome] = useState<number | null>(null);
  const [taxStateKey, setTaxStateKey] =
    useState<IncomeTaxCalculatorUSState | null>(null);

  const federalFilingBrackets =
    filingStatus === IncomeTaxCalculatorFilingStatusKey.SINGLE
      ? usIncomeTaxes2023.federalSingleFilersIncomeTaxBrackets
      : usIncomeTaxes2023.federalMarriedFilersIncomeTaxBrackets;

  const federalTax = householdIncome
    ? calculateFederalTax(householdIncome, federalFilingBrackets)
    : undefined;

  const stateTax = useMemo(() => {
    if (!householdIncome || !taxStateKey) {
      return;
    }

    const taxState = usIncomeTaxes2023.stateIncomeTaxesByStates.find(
      ({ key }) => key === taxStateKey,
    );

    if (!taxState) {
      return;
    }

    return calculateStateTax({
      income: householdIncome,
      taxStateBrackets: taxState.brackets[filingStatus],
    });
  }, [filingStatus, householdIncome, taxStateKey]);

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

      {federalTax && householdIncome && (
        <>
          <IncomeTaxCalculatorResults
            federalTax={federalTax}
            householdIncome={householdIncome}
            stateTax={stateTax}
          />

          <div className="flex flex-wrap gap-4">
            {federalFilingBrackets.map(
              ({ rate, upper: bracketUpper, lower }, index) => {
                const upper = bracketUpper ?? Number.POSITIVE_INFINITY;

                return (
                  <div key={rate}>
                    <span>{rate * 100}%</span>

                    <div
                      style={{
                        width: BASE_BRACKET_WIDTH * (index + 1),
                      }}
                      className="relative h-[90px] ring-1"
                    >
                      <div
                        style={{
                          width:
                            householdIncome > upper ||
                            (householdIncome <= upper &&
                              householdIncome > lower)
                              ? `${Math.min(
                                  100,
                                  (householdIncome / upper) * 100,
                                )}%`
                              : 0,
                        }}
                        className={`absolute left-0 top-0 h-full bg-red-500`}
                      >
                        {householdIncome <= upper &&
                          householdIncome > lower && (
                            <span className="absolute -right-1/2 top-1/2 -translate-y-1/2">
                              {formatToUSDCurrency(householdIncome)}
                            </span>
                          )}
                      </div>
                    </div>

                    <p className="text-right">{formatToUSDCurrency(upper)}</p>
                  </div>
                );
              },
            )}
          </div>
        </>
      )}
    </div>
  );
};

const BASE_BRACKET_WIDTH = 50;
