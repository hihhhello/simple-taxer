import { createAuthorizedCaller } from '@/server';
import { NextRequest, NextResponse } from 'next/server';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Transaction } from '@/shared/types';
import { formatISO, isValid, parse } from 'date-fns';

type ParsedTransaction = {
  amount: number;
  bankName: string | null;
  sourceName: string | null;
  date: Date;
};

function parseToDate(dateString: string) {
  // Array of potential date formats to try
  const dateFormats = [
    'MMM dd',
    'MMMM dd',
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'M/d/yyyy',
    'MMMM dd, yyyy',
  ];

  for (const format of dateFormats) {
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
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const csvFile = formData.get('csv') as File;

  const csvFileText = await csvFile.text();

  const rows = csvFileText.split('\n');
  const data = rows.map((row) => row.split(','));

  const caller = await createAuthorizedCaller();

  const parsedTransactions = await new Promise<ParsedTransaction[]>(
    (resolve, reject) => {
      const results: ParsedTransaction[] = [];

      const readableStream = Readable.from(csvFileText);

      readableStream
        .pipe(csvParser())
        .on(
          'data',
          (
            data: Partial<{
              Amount: string;
              Date: string;
              Source: string;
              Bank: string;
            }>,
          ) => {
            if (!data.Amount || !data.Date) {
              return;
            }

            results.push({
              amount: parseFloat(data.Amount.replace(/[^\d.]/g, '')),
              bankName: data.Bank ?? null,
              sourceName: data.Source ?? null,
              date: parseToDate(data.Date) ?? new Date(),
            });
          },
        )
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    },
  );

  const newTransactions = await caller.transactions.createMany(
    parsedTransactions,
  );

  return NextResponse.json(newTransactions);
}
