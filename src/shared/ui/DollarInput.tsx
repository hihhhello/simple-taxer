'use client';

import React, { ChangeEvent, useMemo } from 'react';
import { formatUSDDecimal } from '../utils/helpers';
import { Input } from './Input';

type DollarInputProps = Omit<
  JSX.IntrinsicElements['input'],
  'onChange' | 'value' | 'type'
> & {
  /**
   * @param value value with formatted toFixed(2).
   */
  handleValueChange?: (value: number) => void;

  /**
   * @param event the original event.
   */
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  value: number | null;
};

export const DollarInput = ({
  handleChange,
  handleValueChange,
  value,
  ...inputProps
}: DollarInputProps) => {
  const formattedValue = useMemo(() => {
    if (value === null) {
      return '';
    }

    return formatUSDDecimal(value);
  }, [value]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, '');
    let numericValue = parseFloat(rawValue) / 100;

    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    handleValueChange?.(numericValue);
    handleChange?.(event);
  };

  return (
    <Input
      type="text"
      value={formattedValue}
      onChange={handleInputChange}
      {...inputProps}
    />
  );
};
