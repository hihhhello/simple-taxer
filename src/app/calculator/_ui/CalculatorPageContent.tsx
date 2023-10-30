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
  classNames,
  formatUSDDecimal,
  formatUSDInteger,
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
import { CalculatorIllustrationDesktop } from '@/shared/illustartions/CalculatorIllustrationDesktop';
import { CalculatorIllustrationMobile } from '@/shared/illustartions/CalculatorIllustrationMobile';
import { TaxExplanationCard } from './TaxExplanationCard/TaxExplanationCard';
import { CheckOnDesktopIllustration } from '@/shared/illustartions/CheckOnDesktopIllustration';

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
      <div className="mb-12 flex flex-col gap-6 sm:flex-row">
        <div className="justify-space-between flex items-center gap-12 rounded-2xl bg-white px-6 py-4">
          <div>
            <p className="text-3xl font-semibold leading-tight text-primary-blue sm:text-5xl">
              Calculate
            </p>
            <p className="text-3xl font-semibold leading-tight text-primary-light-blue sm:text-5xl">
              Save
            </p>
            <p className="text-3xl font-semibold leading-tight text-primary-blue sm:text-5xl">
              Prosper
            </p>
          </div>

          <div className="hidden sm:block">
            <CalculatorIllustrationDesktop />
          </div>

          <div className="sm:hidden">
            <CalculatorIllustrationMobile />
          </div>
        </div>

        <IncomeTaxCalculatorForm
          handleCalculateTaxes={handleCalculateTaxes}
          totalIncome={totalIncome}
          me={me}
        />
      </div>

      {totalTax && federalTax && !isNil(stateTax) && householdIncome && (
        <>
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <TaxExplanationCard
                amount={federalTax}
                title="Federal Tax"
                percent={(federalTax * 100) / householdIncome}
                description="Federal tax, in the context of your household income, is the
                portion of your earnings that is required to be paid to the
                federal government. This tax serves as a source of revenue for
                the government to fund various programs and services, such as
                national defense, infrastructure, and social services."
              />
            </div>

            <div className="sm:col-span-1 sm:row-start-2">
              <TaxExplanationCard
                amount={stateTax}
                title="State Tax"
                percent={(stateTax * 100) / householdIncome}
                description="State tax, within the context of your household income, is
                the portion of your earnings that is mandated to be paid to
                the state government where you reside. This tax revenue is
                utilized by the state to support various public services and
                initiatives, including education, healthcare, and
                infrastructure development."
              />
            </div>

            <div className="sm:col-span-1 sm:row-start-2">
              <TaxExplanationCard
                amount={totalTax}
                title="Total Tax"
                percent={(totalTax * 100) / householdIncome}
                description="Total tax, in the context of your household income, is the
                cumulative amount of taxes you are required to pay, which
                includes both federal and state taxes. These taxes are
                essential sources of revenue for the government, enabling it
                to fund various public services and programs at both the
                federal and state levels."
              />
            </div>

            <div className="sm:col-span-2 sm:row-span-2">
              <TaxExplanationCard
                amount={totalTax}
                title="Take home pay"
                percent={(totalTax * 100) / householdIncome}
                description="Take-home pay, in the context of your household income,
                represents the amount of money you receive after all
                applicable taxes and deductions have been subtracted from
                your gross income. It is the income that you can actually
                use for your everyday expenses, savings, and discretionary
                spending."
                shadowBgClassName="bg-primary-green"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 py-2 sm:px-4">
              <span className="text-xl font-bold text-primary-blue sm:text-3xl">
                Federal Income Tax Brackets
              </span>
            </div>

            <div className="relative rounded-2xl bg-white py-5 pl-4 pr-36 sm:hidden">
              <p className="text-sm leading-tight text-primary-blue">
                Hey there! This bit&apos;s a little shy on mobile. Give it a
                peek on a tablet or desktop for the full view!
              </p>

              <div className="absolute bottom-1 right-0 z-50">
                <CheckOnDesktopIllustration />
              </div>
            </div>

            <div className="hidden rounded-2xl bg-white p-6 sm:block">
              <div className="mb-10 flex gap-4">
                {federalFilingBrackets.map(
                  ({ rate, upper: bracketUpper, lower }, index) => {
                    const upper = bracketUpper ?? Number.POSITIVE_INFINITY;

                    const bracketFillingPercent =
                      householdIncome > upper ||
                      (householdIncome <= upper && householdIncome > lower)
                        ? Math.min(100, (householdIncome / upper) * 100)
                        : 0;

                    return (
                      <div
                        key={rate}
                        className="relative flex flex-col items-center"
                        style={{
                          width: BASE_BRACKET_WIDTH * (index + 1),
                        }}
                      >
                        <span className="text-primary-light-blue">
                          {rate * 100}%
                        </span>

                        <div className="relative mb-2 h-[90px] w-full rounded-lg border-2 border-primary-light-blue">
                          <div
                            style={{
                              width: `${bracketFillingPercent}%`,
                            }}
                            className={classNames(
                              'absolute left-0 top-0 h-full bg-primary-light-blue',
                              bracketFillingPercent < 100 && 'rounded-r-2xl',
                            )}
                          >
                            {/* {householdIncome <= upper &&
                              householdIncome > lower && (
                                <span className="absolute -right-1/2 top-1/2 -translate-y-1/2">
                                  {formatToUSDCurrency(householdIncome)}
                                </span>
                              )} */}
                          </div>
                        </div>

                        <div className="mb-2 h-3 w-full border-x border-b border-primary-light-blue"></div>

                        {index === 0 && (
                          <p className="absolute bottom-0 left-0 translate-y-full text-right text-sm">
                            $0
                          </p>
                        )}

                        <p
                          className={classNames(
                            'absolute bottom-0 right-0 translate-y-full text-right text-sm',
                            upper !== Infinity && 'translate-x-3/4',
                          )}
                        >
                          {upper === Infinity
                            ? `>${formatUSDInteger(lower)}`
                            : formatUSDInteger(upper)}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="rounded-xl bg-primary-yellow p-6">
                <p className="text-xs text-primary-blue">
                  <span className="text-sm font-semibold text-primary-light-blue">
                    Exp.
                  </span>
                  :Federal Income Tax Brackets are a way the U.S. government
                  calculates how much tax you owe based on your income. The more
                  you earn, the higher the percentage of your income you pay in
                  taxes. There are different income ranges or
                  &quot;brackets&quot; each with its own tax rate. Lower incomes
                  are taxed at lower rates, and higher incomes are taxed at
                  higher rates to ensure a fair system where higher earners pay
                  more in taxes.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const BASE_BRACKET_WIDTH = 60;
