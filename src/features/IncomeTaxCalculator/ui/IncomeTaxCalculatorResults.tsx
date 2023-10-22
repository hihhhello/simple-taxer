import { formatToUSDCurrency } from '@/shared/utils/helpers';
import { isNil } from 'lodash';

type IncomeTaxCalculatorResultsProps = {
  federalTax: number;
  stateTax: number | undefined;
  householdIncome: number;
};

export const IncomeTaxCalculatorResults = ({
  federalTax,
  householdIncome,
  stateTax,
}: IncomeTaxCalculatorResultsProps) => {
  const totalTax =
    !isNil(stateTax) && !isNil(federalTax) ? stateTax + federalTax : undefined;

  return (
    <div>
      <p>
        <span>Federal tax: {formatToUSDCurrency(federalTax)}</span>{' '}
        <span>{'='}</span>{' '}
        <span>
          {((federalTax * 100) / householdIncome).toFixed(2)}% from household
          income
        </span>
      </p>

      {!isNil(stateTax) && (
        <p>
          <span>State tax: {formatToUSDCurrency(stateTax)}</span>{' '}
          <span>{'='}</span>{' '}
          <span>
            {((stateTax * 100) / householdIncome).toFixed(2)}% from household
            income
          </span>
        </p>
      )}

      {totalTax && (
        <>
          <p>
            <span>Total tax: {formatToUSDCurrency(totalTax)}</span>{' '}
            <span>{'='}</span>{' '}
            <span>
              {((totalTax * 100) / householdIncome).toFixed(2)}% from household
              income
            </span>
          </p>

          <p>
            <span>Take home pay</span> <span>{'='}</span>{' '}
            <span>{formatToUSDCurrency(householdIncome - totalTax)}</span>
          </p>
        </>
      )}
    </div>
  );
};
