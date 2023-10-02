import { DollarInput } from '@/shared/ui';
import { formatToUSDCurrency } from '@/shared/utils';
import { useState } from 'react';

const SINGLE_FILERS_TAX_BRACKETS_2023 = [
  { rate: 0.1, lower: 0, upper: 11000 },
  { rate: 0.12, lower: 11000, upper: 44725 },
  { rate: 0.22, lower: 44725, upper: 95375 },
  { rate: 0.24, lower: 95375, upper: 182100 },
  { rate: 0.32, lower: 182100, upper: 231250 },
  { rate: 0.35, lower: 231250, upper: 578125 },
  { rate: 0.37, lower: 578125, upper: Number.POSITIVE_INFINITY },
];

const MARRIED_FILERS_TAX_BRACKETS_2023 = [
  { rate: 0.1, lower: 0, upper: 22000 },
  { rate: 0.12, lower: 22000, upper: 89450 },
  { rate: 0.22, lower: 89450, upper: 190750 },
  { rate: 0.24, lower: 190750, upper: 364200 },
  { rate: 0.32, lower: 364200, upper: 462500 },
  { rate: 0.35, lower: 462500, upper: 693750 },
  { rate: 0.37, lower: 693750, upper: Number.POSITIVE_INFINITY },
];

const STANDARD_DEDUCTION_2023 = {
  single: 13850,
  married: 27700,
  head: 20800,
};

type TaxCalculatorProps = {
  totalIncome: number;
};

export const TaxCalculator = ({ totalIncome }: TaxCalculatorProps) => {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>(
    'single',
  );
  const [householdIncome, setHouseholdIncome] = useState<number | null>(null);

  const calculateTax = (income: number, brackets: any[]): number => {
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

  const filingBrackets =
    filingStatus === 'single'
      ? SINGLE_FILERS_TAX_BRACKETS_2023
      : MARRIED_FILERS_TAX_BRACKETS_2023;

  const tax = householdIncome
    ? calculateTax(householdIncome, filingBrackets)
    : undefined;

  return (
    <div>
      <div className="mx-auto w-full max-w-xs">
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

          <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
              htmlFor="job-title"
              className="block text-xs font-medium text-gray-900"
            >
              Filing Status
            </label>

            <select
              id="filingStatus"
              name="filingStatus"
              autoComplete="country-name"
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
        </div>
      </div>

      {tax && householdIncome && (
        <>
          <p>
            <span>{formatToUSDCurrency(tax)}</span> <span>=</span>{' '}
            <span>
              {Math.round((tax * 100) / householdIncome)}% from household income
            </span>
          </p>

          <div className="flex flex-wrap gap-4">
            {filingBrackets.map(({ rate, upper, lower }, index) => (
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
                        (householdIncome <= upper && householdIncome > lower)
                          ? `${Math.min(100, (householdIncome / upper) * 100)}%`
                          : 0,
                    }}
                    className={`absolute left-0 top-0 h-full bg-red-500`}
                  >
                    {householdIncome <= upper && householdIncome > lower && (
                      <span className="absolute -right-1/2 top-1/2 -translate-y-1/2">
                        {formatToUSDCurrency(householdIncome)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-right">{formatToUSDCurrency(upper)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const BASE_BRACKET_WIDTH = 50;
