import { twMerge } from 'tailwind-merge';

export const Input = ({
  className,
  ...inputProps
}: JSX.IntrinsicElements['input']) => (
  <input
    className={twMerge(
      'block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green sm:text-sm sm:leading-6',
      className,
    )}
    {...inputProps}
  />
);
