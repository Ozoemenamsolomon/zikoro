import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }
  const {email, amount, metadata, } = await req.json();
    
    console.log('Received request to initialize transaction:');
    console.log(`Email: ${email}, Amount: ${amount}, Metadata: ${metadata} `);
    
    // Input validation
    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required' },
        { status: 400 }
      );
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, 
          metadata: metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from Paystack:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Transaction initialized successfully:', data);
      return NextResponse.json(
        { data },
        { status: 200 }
      );
    } catch (error) {
      console.error('CATCH ERROR:', error);
      return NextResponse.json(
        { error: 'An error occurred while processing the request' },
        { status: 500 }
      );
    }
}
