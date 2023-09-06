export type UploadCSVParsedTransaction = {
  amount: number;
  bankName: string | null;
  sourceName: string | null;
  date: Date;
};
