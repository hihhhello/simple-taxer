import { NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';

import { plaidClient } from '@/shared/utils/plaid';

export async function GET() {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: process.env.PLAID_CLIENT_ID || '' },
    client_name: 'Simple Taxer',
    language: 'en',
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });

  return NextResponse.json(tokenResponse.data);
}
