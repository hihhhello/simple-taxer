import { LabelHTMLAttributes, ReactNode } from 'react';

type InputWrapperProps = {
  label: string;
  children: ReactNode;
  htmlFor: LabelHTMLAttributes<HTMLLabelElement>['htmlFor'];
  InlineEndElement?: ReactNode;
};

export const InputWrapper = ({
  children,
  label,
  htmlFor,
  InlineEndElement,
}: InputWrapperProps) => (
  <div>
    <div className="mb-1 flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className="rounded-md bg-primary-green px-4 py-1 text-xs text-white sm:text-sm"
      >
        {label}
      </label>

      {InlineEndElement}
    </div>

    {children}
  </div>
);
