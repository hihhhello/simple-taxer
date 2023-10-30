import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';

type TaxExplanationCardProps = {
  title: string;
  amount: number;
  percent?: number;
  shadowBgClassName?: string;
  description: string;
};

export const TaxExplanationCard = ({
  amount,
  percent,
  title,
  shadowBgClassName = 'bg-primary-light-blue',
  description,
}: TaxExplanationCardProps) => {
  return (
    <div className="relative ml-2 h-full rounded-2xl bg-white p-4">
      <div
        className={classNames(
          'absolute -left-2 -top-2 -z-10 h-full w-full rounded-3xl',
          shadowBgClassName,
        )}
      ></div>

      <div className="mb-4 flex items-start justify-between">
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

      <p className="text-xs text-primary-blue">
        <span className="text-sm font-semibold text-primary-light-blue">
          Exp.:
        </span>
        {description}
      </p>
    </div>
  );
};
