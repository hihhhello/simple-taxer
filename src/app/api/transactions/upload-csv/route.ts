import { NextRequest, NextResponse } from 'next/server';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

import { createAuthorizedCaller } from '@/server';

import { parseDateStringToDate } from './utils/uploadCSVHelpers';
import { UploadCSVParsedTransaction } from './utils/uploadCSVTypes';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const csvFile = formData.get('csv') as File | null;

  if (!csvFile) {
    return new Response('No CSV file found in the received FormData.', {
      status: 400,
    });
  }

  const csvFileText = await csvFile.text();

  const caller = await createAuthorizedCaller();

  const parsedTransactions = await new Promise<UploadCSVParsedTransaction[]>(
    (resolve, reject) => {
      const results: UploadCSVParsedTransaction[] = [];

      const csvFileTextReadableStream = Readable.from(csvFileText);

      csvFileTextReadableStream
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
              date: parseDateStringToDate(data.Date) ?? new Date(),
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
