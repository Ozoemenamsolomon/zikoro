import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deploymentUrl } from "@/utils";
import { BookingFormData } from "@/components/appointments/booking/Calender";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "POST") {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body: BookingFormData = await req.json();
    console.log('POST',{ body });

    const { data, error } = await supabase
      .from('bookings')
      .insert([body])
      .select('*')
      .single();

    if (error) {
      console.error({ error });
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data },
      { status: 201 }
    );
  } catch (error) {
    console.error({ error });

    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}
