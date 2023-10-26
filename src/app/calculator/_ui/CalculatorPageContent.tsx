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
            <p className="text-5xl font-semibold leading-tight text-primary-blue">
              Calculate
            </p>
            <p className="text-5xl font-semibold leading-tight text-primary-light-blue">
              Save
            </p>
            <p className="text-5xl font-semibold leading-tight text-primary-blue">
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

      {totalTax && federalTax && !isNil(stateTax) && householdIncome && (
        <>
          <div>
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-primary-yellow flex items-center justify-center rounded-full px-4 py-2">
                  <span className="text-primary-blue">Federal Tax</span>
                </div>

                <div className="flex gap-2">
                  <div className="flex items-center justify-center rounded-full bg-primary-blue px-4 py-2">
                    <span className="text-white">
                      {formatToUSDCurrency(federalTax)}
                    </span>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue">
                    <span className="text-2xs leading-none text-white">
                      {((federalTax * 100) / householdIncome).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-primary-blue">
                <span className="text-sm font-semibold text-primary-light-blue">
                  Exp.
                </span>
                :Federal tax, in the context of your household income, is the
                portion of your earnings that is required to be paid to the
                federal government. This tax serves as a source of revenue for
                the government to fund various programs and services, such as
                national defense, infrastructure, and social services.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-primary-yellow flex items-center justify-center rounded-full px-4 py-2">
                  <span className="text-primary-blue">State Tax</span>
                </div>

                <div className="flex gap-2">
                  <div className="flex items-center justify-center rounded-full bg-primary-blue px-4 py-2">
                    <span className="text-white">
                      {formatToUSDCurrency(stateTax)}
                    </span>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue">
                    <span className="text-2xs leading-none text-white">
                      {((stateTax * 100) / householdIncome).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-primary-blue">
                <span className="text-sm font-semibold text-primary-light-blue">
                  Exp.
                </span>
                :State tax, within the context of your household income, is the
                portion of your earnings that is mandated to be paid to the
                state government where you reside. This tax revenue is utilized
                by the state to support various public services and initiatives,
                including education, healthcare, and infrastructure development.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-primary-yellow flex items-center justify-center rounded-full px-4 py-2">
                  <span className="text-primary-blue">Total Tax</span>
                </div>

                <div className="flex gap-2">
                  <div className="flex items-center justify-center rounded-full bg-primary-blue px-4 py-2">
                    <span className="text-white">
                      {formatToUSDCurrency(totalTax)}
                    </span>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue">
                    <span className="text-2xs leading-none text-white">
                      {((totalTax * 100) / householdIncome).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-primary-blue">
                <span className="text-sm font-semibold text-primary-light-blue">
                  Exp.
                </span>
                :Total tax, in the context of your household income, is the
                cumulative amount of taxes you are required to pay, which
                includes both federal and state taxes. These taxes are essential
                sources of revenue for the government, enabling it to fund
                various public services and programs at both the federal and
                state levels.
              </p>
            </div>
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
