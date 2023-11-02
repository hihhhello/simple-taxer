import { ChevronLeftIcon } from '@/shared/icons/ChevronLeftIcon';
import { classNames, formatUSDDecimal } from '@/shared/utils/helpers';
import { useIsDesktop } from '@/shared/utils/hooks';
import { Disclosure, Transition } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

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
  const isDesktop = useIsDesktop();

  return (
    <Disclosure
      as="div"
      className="relative ml-2 h-full rounded-lg bg-white p-2 sm:rounded-2xl sm:p-4"
    >
      {({ open }) => (
        <>
          <div
            className={twMerge(
              'absolute -left-1 top-0 -z-10 mt-1 h-[115%] w-full rounded-lg sm:-left-2 sm:-top-2 sm:h-full sm:rounded-3xl',
              shadowBgClassName,
              open && 'h-[105%]',
            )}
          />

          <div className="mb-2 flex items-start justify-between sm:mb-4">
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

          {isDesktop && (
            <p className="text-xs text-primary-blue">
              <span className="text-sm font-semibold text-primary-light-blue">
                Exp.:
              </span>

              {description}
            </p>
          )}

          {!isDesktop && (
            <Disclosure.Panel as="p" className="text-xs text-primary-blue">
              <span className="text-sm font-semibold text-primary-light-blue">
                Exp.:
              </span>

              {description}
            </Disclosure.Panel>
          )}

          <Disclosure.Button className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center text-[8px] text-white sm:hidden">
            <span>{open ? 'Hide' : 'Details'}</span>
            <ChevronLeftIcon
              className={twMerge('h-[12px] -rotate-90', open && 'rotate-90')}
            />
          </Disclosure.Button>
        </>
      )}
    </Disclosure>
  );
};
