'use client';

import { useCallback, useMemo, useState } from 'react';
import { User } from 'next-auth';
import { isNil } from 'lodash';

import {
  IncomeTaxCalculatorForm,
  IncomeTaxCalculatorFormProps,
} from '@/app/calculator/_ui/IncomeTaxCalculator/IncomeTaxCalculatorForm';
import { api } from '@/shared/api';
import {
  calculateTotalIncome,
  formatToUSDCurrency,
} from '@/shared/utils/helpers';
import {
  IncomeTaxCalculatorFilingStatus,
  IncomeTaxCalculatorFilingStatusKey,
  IncomeTaxCalculatorUSState,
} from '@/app/calculator/_ui/IncomeTaxCalculator/utils/incomeTaxCalculatorTypes';
import usIncomeTaxes2023 from '@/shared/data/usIncomeTaxes2023.json';
import {
  calculateFederalTax,
  calculateStateTax,
} from '@/app/calculator/_ui/IncomeTaxCalculator/utils/incomeTaxCalculatorHelpers';
import { CalculatorIllustration } from '@/shared/illustartions/CalculatorIllustration';

type CalculatorPageContentProps = {
  transactions: ApiRouterOutputs['transactions']['getAll'];
  me: User | undefined | null;
};

export const CalculatorPageContent = ({
  transactions: initialTransactions,
  me,
}: CalculatorPageContentProps) => {
  const [filingStatus, setFilingStatus] =
    useState<IncomeTaxCalculatorFilingStatus>(
      IncomeTaxCalculatorFilingStatusKey.SINGLE,
    );
  const [householdIncome, setHouseholdIncome] = useState<number | null>(null);
  const [taxStateKey, setTaxStateKey] =
    useState<IncomeTaxCalculatorUSState | null>(null);

  const { data: transactions } = api.transactions.getAll.useQuery(
    {},
    {
      initialData: initialTransactions,
    },
  );

  const handleCalculateTaxes: IncomeTaxCalculatorFormProps['handleCalculateTaxes'] =
    useCallback((values) => {
      setFilingStatus(values.filingStatus);
      setHouseholdIncome(values.householdIncome);
      setTaxStateKey(values.taxStateKey);
    }, []);

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

  const totalIncome = useMemo(
    () => calculateTotalIncome(transactions?.data),
    [transactions],
  );

  const totalTax =
    !isNil(stateTax) && !isNil(federalTax) ? stateTax + federalTax : undefined;

  return (
    <div className="pt-8">
      <div className="flex gap-6">
        <div className="justify-space-between flex items-center gap-12 rounded-2xl bg-white px-6 py-4">
          <div>
            <p className="text-primary-blue text-5xl font-semibold leading-tight">
              Calculate
            </p>
            <p className="text-primary-light-blue text-5xl font-semibold leading-tight">
              Save
            </p>
            <p className="text-primary-blue text-5xl font-semibold leading-tight">
              Prosper
            </p>
          </div>

          <CalculatorIllustration />
        </div>

        <IncomeTaxCalculatorForm
          handleCalculateTaxes={handleCalculateTaxes}
          totalIncome={totalIncome}
          me={me}
        />
      </div>

      {federalTax && householdIncome && (
        <>
          <div>
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
          </div>

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
