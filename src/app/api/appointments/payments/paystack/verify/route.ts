import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deploymentUrl } from "@/utils";
import { AppointmentLink } from "@/types/appointments";
import { generateSlug } from "@/lib/generateSlug";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "POST") {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

    try {
      const {reference} = await req.json();
      console.log('POST BODY:',{ reference });
      if (!reference) {
        return NextResponse.json(
          { error: 'Payment reference is required' },
          { status: 400 }
        );
      }
  
      const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_PUBLIC_SECRET_KEY;
      const BY = process.env.BY;
      const VER = process.env.VER;
  
      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const dbData = await supabase
            .from('paystack')
            .select('amount, status, channel, currency, reference')
            .eq('reference', reference)
            .single()
  
      const data = await verifyResponse.json();
    // console.log({data, dbData:dbData?.data})
    // TODO: if webhook is not use to add payment, then we can use this reference data and metada of which should contain the product and payment details to add paymnent to the table.
      if (
        data.status && 
        data.data.status === 'success' && 
        data.data.amount/100 === dbData?.data?.amount &&
        data.data.reference === dbData?.data?.reference 
    ) {
      return NextResponse.json(
        { success: true, 
          message: 'Payment verified successfully', 
          data: data.data 
        },
        { status: 201 }
      );
      } else {
        return NextResponse.json(
          { success: false, 
            message: 'Payment verification failed',
             data:null},
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return NextResponse.json(
        { error: 'An error occurred while processing the request' },
        { status: 500 }
      );
    }
  }
  