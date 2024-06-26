import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BookingFormData } from "@/components/appointments/booking/Calender";

export async function handler(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { method } = req;
    
    if (method === "GET") {
      const url = new URL(req.url);
      const appointmentDate = url.searchParams.get("appointmentDate");

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('appointmentDate', appointmentDate)
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
        { status: 200 }
      );
    } 
    
    if (method === "POST") {
      const body: BookingFormData = await req.json();

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
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );

  } catch (error) {
    console.error({ error });

    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST };
