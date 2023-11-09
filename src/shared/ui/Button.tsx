import { twMerge } from 'tailwind-merge';

export const Button = ({
  className,
  ...inputProps
}: JSX.IntrinsicElements['button']) => (
  <button className={twMerge('focus-primary', className)} {...inputProps} />
);
