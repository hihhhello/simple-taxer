export const calculateFederalTax = (
  income: number,
  brackets: any[],
): number => {
  const { tax } = brackets.reduce(
    (acc, bracket) => {
      if (acc.remainingIncome <= bracket.lower) return acc;

      const taxableIncome =
        Math.min(acc.remainingIncome, bracket.upper) - bracket.lower;

      acc.tax += taxableIncome * bracket.rate;

      if (acc.remainingIncome <= bracket.upper) acc.remainingIncome = 0;

      return acc;
    },
    { tax: 0, remainingIncome: income },
  );

  return tax;
};

export const calculateStateTax = ({
  income,
  taxStateBrackets,
}: {
  income: number;
  taxStateBrackets: { rate: number; lower: number; upper: number | null }[];
}) => {
  const taxBracket = taxStateBrackets.find(
    ({ lower, upper }) =>
      income > lower && income <= (upper ?? Number.POSITIVE_INFINITY),
  );

  if (!taxBracket) {
    return;
  }

  return income * taxBracket.rate;
};
