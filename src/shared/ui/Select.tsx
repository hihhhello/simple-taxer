import { twMerge } from 'tailwind-merge';

export const Select = ({
  className,
  ...inputProps
}: JSX.IntrinsicElements['select']) => (
  <select
    className={twMerge(
      'block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green sm:text-base',
      className,
    )}
    {...inputProps}
  />
);
