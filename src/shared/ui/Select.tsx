import { twMerge } from 'tailwind-merge';

export const Select = ({
  className,
  ...inputProps
}: JSX.IntrinsicElements['select']) => (
  <select
    className={twMerge(
      'focus-primary block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-base',
      className,
    )}
    {...inputProps}
  />
);
