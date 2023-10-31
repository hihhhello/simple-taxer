import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';

type CalculatorTaxExplanationCardProps = {
  title: string;
  amount: number;
  percent?: number;
  shadowBgClassName?: string;
  description: string;
};

export const CalculatorTaxExplanationCard = ({
  amount,
  percent,
  title,
  shadowBgClassName = 'bg-primary-light-blue',
  description,
}: CalculatorTaxExplanationCardProps) => {
  return (
    <div className="relative ml-2 h-full rounded-lg bg-white p-2 sm:rounded-2xl sm:p-4">
      <div
        className={classNames(
          'absolute -bottom-3 -left-1 -z-10 h-[115%] w-full rounded-lg sm:-left-2 sm:-top-2 sm:h-full sm:rounded-3xl',
          shadowBgClassName,
        )}
      ></div>

      <div className="flex items-start justify-between sm:mb-4">
        <div className="flex items-center justify-center rounded-full bg-primary-yellow px-4 py-2">
          <span className="text-primary-blue">{title}</span>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-full bg-primary-blue px-4 py-2">
            <span className="text-white">{formatUSDDecimal(amount)}</span>
          </div>

          {Boolean(percent) && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue">
              <span className="text-2xs leading-none text-white">
                {percent?.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="hidden text-xs text-primary-blue sm:block">
        <span className="text-sm font-semibold text-primary-light-blue">
          Exp.:
        </span>
        {description}
      </p>
    </div>
  );
};
