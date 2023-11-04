import { LabelHTMLAttributes, ReactNode } from 'react';

type InputWrapperProps = {
  label: string;
  children: ReactNode;
  htmlFor: LabelHTMLAttributes<HTMLLabelElement>['htmlFor'];
};

export const InputWrapper = ({
  children,
  label,
  htmlFor,
}: InputWrapperProps) => (
  <div>
    <div className="mb-1">
      <label
        htmlFor={htmlFor}
        className="rounded-md bg-primary-green px-4 py-1 text-xs text-white sm:text-sm"
      >
        {label}
      </label>
    </div>

    {children}
  </div>
);
