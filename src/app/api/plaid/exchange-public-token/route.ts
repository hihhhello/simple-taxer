import { NextRequest, NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';

import { plaidClient } from '@/shared/utils/plaid';

export async function POST(req: NextRequest) {
  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: (await req.json()).publicToken,
  });

  const response = await plaidClient.accountsBalanceGet({
    access_token: exchangeResponse.data.access_token,
  });

  return NextResponse.json({ accessToken: exchangeResponse.data.access_token });
}
