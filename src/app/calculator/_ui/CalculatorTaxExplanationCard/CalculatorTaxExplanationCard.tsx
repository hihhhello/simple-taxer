import { ChevronLeftIcon } from '@/shared/icons/ChevronLeftIcon';
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
      />

      <div className="flex items-start justify-between sm:mb-4">
        <div className="flex items-center justify-center rounded-full bg-primary-yellow px-4 py-1 text-sm sm:py-2 sm:text-base">
          <span className="leading-tight text-primary-blue">{title}</span>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-full bg-primary-blue px-4 py-1 sm:h-9 sm:py-2">
            <span className="text-sm leading-tight text-white sm:text-base">
              {formatUSDDecimal(amount)}
            </span>
          </div>

          {Boolean(percent) && (
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-primary-blue sm:h-9 sm:w-9">
              <span className="text-[8px] leading-tight text-white sm:text-2xs">
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

      <button className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center text-[8px] text-white sm:hidden">
        <span>Details</span>
        <ChevronLeftIcon className="h-[12px] -rotate-90" />
      </button>
    </div>
  );
};
