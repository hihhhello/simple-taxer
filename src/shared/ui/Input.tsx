import { twMerge } from 'tailwind-merge';

export const Input = ({
  className,
  ...inputProps
}: JSX.IntrinsicElements['input']) => (
  <input
    className={twMerge(
      'block w-full rounded-md border-0 px-4 py-1.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-base',
      className,
    )}
    {...inputProps}
  />
);
