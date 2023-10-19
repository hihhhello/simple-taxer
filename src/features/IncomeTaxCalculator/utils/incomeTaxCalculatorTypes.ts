export type IncomeTaxCalculatorStateIncomeTaxBracket = {
  rate: number;
  lower: number;
  upper: number | null;
};

export type IncomeTaxCalculatorStateIncomeTax = {
  key: string;
  name: string;
  taxType: 'graduated' | 'flat' | 'none';
  brackets: {
    single: IncomeTaxCalculatorStateIncomeTaxBracket[];
    married: IncomeTaxCalculatorStateIncomeTaxBracket[];
  };
};

export const IncomeTaxCalculatorFilingStatusKey = {
  MARRIED: 'married',
  SINGLE: 'single',
} as const;

export type IncomeTaxCalculatorFilingStatus =
  (typeof IncomeTaxCalculatorFilingStatusKey)[keyof typeof IncomeTaxCalculatorFilingStatusKey];

export const IncomeTaxCalculatorUSStateKey = {
  AL: 'AL',
  AK: 'AK',
  AZ: 'AZ',
  AR: 'AR',
  CA: 'CA',
  CO: 'CO',
  CT: 'CT',
  DE: 'DE',
  FL: 'FL',
  GA: 'GA',
  HI: 'HI',
  ID: 'ID',
  IL: 'IL',
  IN: 'IN',
  IA: 'IA',
  KS: 'KS',
  KY: 'KY',
  LA: 'LA',
  ME: 'ME',
  MD: 'MD',
  MA: 'MA',
  MI: 'MI',
  MN: 'MN',
  MS: 'MS',
  MO: 'MO',
  MT: 'MT',
  NE: 'NE',
  NV: 'NV',
  NH: 'NH',
  NJ: 'NJ',
  NM: 'NM',
  NY: 'NY',
  NC: 'NC',
  ND: 'ND',
  OH: 'OH',
  OK: 'OK',
  OR: 'OR',
  PA: 'PA',
  RI: 'RI',
  SC: 'SC',
  SD: 'SD',
  TN: 'TN',
  TX: 'TX',
  UT: 'UT',
  VT: 'VT',
  VA: 'VA',
  WA: 'WA',
  WV: 'WV',
  WI: 'WI',
  WY: 'WY',
  DC: 'DC',
} as const;

export type IncomeTaxCalculatorUSState =
  (typeof IncomeTaxCalculatorUSStateKey)[keyof typeof IncomeTaxCalculatorUSStateKey];
