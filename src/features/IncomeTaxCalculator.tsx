import { useMemo, useState } from 'react';
import { isNil } from 'lodash';

import { DollarInput } from '@/shared/ui';
import { formatToUSDCurrency } from '@/shared/utils';
import usIncomeTaxes2023 from '@/shared/data/usIncomeTaxes2023.json';

type IncomeTaxCalculatorProps = {
  totalIncome: number;
};

export const IncomeTaxCalculator = ({
  totalIncome,
}: IncomeTaxCalculatorProps) => {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>(
    'single',
  );
  const [householdIncome, setHouseholdIncome] = useState<number | null>(null);
  const [taxStateKey, setTaxStateKey] = useState<string | null>(null);

  const calculateFederalTax = (income: number, brackets: any[]): number => {
    const { tax } = brackets.reduce(
      (acc, bracket) => {
        if (acc.remainingIncome <= bracket.lower) return acc;

        const taxableIncome =
          Math.min(acc.remainingIncome, bracket.upper) - bracket.lower;

        acc.tax += taxableIncome * bracket.rate;

        if (acc.remainingIncome <= bracket.upper) acc.remainingIncome = 0;

        return acc;
      },
      { tax: 0, remainingIncome: income },
    );

    return tax;
  };

  const federalFilingBrackets =
    filingStatus === 'single'
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

    const taxBracket = taxState.brackets[filingStatus].find(
      ({ lower, upper }) =>
        householdIncome > lower &&
        householdIncome <= (upper ?? Number.POSITIVE_INFINITY),
    );

    if (!taxBracket) {
      return;
    }

    return householdIncome * taxBracket.rate;
  }, [filingStatus, householdIncome, taxStateKey]);

  const totalTax =
    !isNil(stateTax) && !isNil(federalTax) ? stateTax + federalTax : undefined;

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

              <div className="text-sm">
                <span
                  onClick={() => setHouseholdIncome(totalIncome)}
                  className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                >
                  Use total
                </span>
              </div>
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
                onChange={(e) =>
                  setFilingStatus(e.target.value as typeof filingStatus)
                }
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
                onChange={(e) =>
                  setTaxStateKey(e.target.value as typeof taxStateKey)
                }
              >
                <option value="">Select state</option>

                {usIncomeTaxes2023.stateIncomeTaxesByStates.map(
                  ({ key, name }) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {federalTax && householdIncome && (
        <>
          <p>
            <span>Federal tax: {formatToUSDCurrency(federalTax)}</span>{' '}
            <span>{'='}</span>{' '}
            <span>
              {((federalTax * 100) / householdIncome).toFixed(2)}% from
              household income
            </span>
          </p>

          {!isNil(stateTax) && (
            <p>
              <span>State tax: {formatToUSDCurrency(stateTax)}</span>{' '}
              <span>{'='}</span>{' '}
              <span>
                {((stateTax * 100) / householdIncome).toFixed(2)}% from
                household income
              </span>
            </p>
          )}

          {totalTax && (
            <>
              <p>
                <span>Total tax: {formatToUSDCurrency(totalTax)}</span>{' '}
                <span>{'='}</span>{' '}
                <span>
                  {((totalTax * 100) / householdIncome).toFixed(2)}% from
                  household income
                </span>
              </p>

              <p>
                <span>Take home pay</span> <span>{'='}</span>{' '}
                <span>{formatToUSDCurrency(householdIncome - totalTax)}</span>
              </p>
            </>
          )}

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
