import { ReactNode } from 'react';

type InputWrapperProps = {
  label: string;
  children: ReactNode;
};

export const InputWrapper = ({ children, label }: InputWrapperProps) => (
  <div>
    <div className="mb-1">
      <label
        htmlFor="date"
        className="rounded-md bg-primary-green px-4 py-1 text-xs text-white sm:text-sm"
      >
        {label}
      </label>
    </div>

    {children}
  </div>
);
