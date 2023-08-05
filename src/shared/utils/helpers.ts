const formatterUSDCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatToUSDCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return formatterUSDCurrency.format(value);
};

export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
