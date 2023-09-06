import { isValid, parse } from 'date-fns';

import { UPLOAD_CSV_VALID_DATE_FORMATS } from './uploadCSVConstants';

export const parseDateStringToDate = (dateString: string) => {
  for (const format of UPLOAD_CSV_VALID_DATE_FORMATS) {
    try {
      const parsedDate = parse(dateString, format, new Date());

      if (!isValid(parsedDate)) {
        continue;
      }

      return parsedDate;
    } catch (error) {
      // If parsing fails for a format, continue to the next one
      continue;
    }
  }

  // If none of the formats worked, return null or handle the error accordingly
  return null;
};
