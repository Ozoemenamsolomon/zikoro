import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  console.log('==WEBHOOK==');
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "POST") {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const secret = process.env.PAYSTACK_PUBLIC_SECRET_KEY!;

    // Get the raw body for hashing
    const rawBody = await req.text();
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    if (hash !== req.headers.get('x-paystack-signature')) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = await req.json();
    console.log({ event });

    if (event.event === 'charge.success') {
      const { reference, status, amount, paid_at, created_at, channel, currency, metadata, customer } = event.data;

      const { data, error } = await supabase
        .from('paystack')
        .insert([{
          reference,
          status,
          amount: amount / 100,  // Convert amount from kobo to Naira
          paid_at,
          paystack_created_at: created_at,
          channel,
          currency,
          record: JSON.stringify(metadata),
          customer: JSON.stringify(customer),
          
        }])
        .select('amount, status, channel, currency')
        .single();

      console.log('WEBHOOK_SUPABASE_RESPONSE', { data, error });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to insert into database', details: error },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { data },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unhandled event type' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('Webhook CATCH ERROR:', err);
    return NextResponse.json(
      { error:  'An error occurred while processing the request' },
      { status: 500 }
    );
  }
};
