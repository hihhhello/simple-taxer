import { isValid, parse } from 'date-fns';

export const UPLOAD_CSV_VALID_DATE_FORMATS = [
  'MMM dd',
  'MMMM dd',
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'M/d/yyyy',
  'MMMM dd, yyyy',
];
