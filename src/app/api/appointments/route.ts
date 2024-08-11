

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { startOfDay } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');  
  const userId = searchParams.get('userId');

  if ( !userId || !date) {
    return NextResponse.json({ error: "Missing required parameters", data: null }, { status: 400 });
  } 

  try {
    const today = startOfDay(new Date(date!)).toISOString()

    const {data, error}= await supabase
      .from("bookings")
      .select(`*, appointmentLinkId(*, createdBy(id, userEmail,organization,firstName,lastName,phoneNumber))`)
      .eq("createdBy", userId)
      .gte('appointmentDate', today)
      .order("appointmentDate", { ascending: true });

    console.log({res:{data,error},userId,date,today})

    if (error) {
      console.error("Error fetching bookings:", error.message);
      return NextResponse.json({data:null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, count:data?.length, error:null }, { status: 200 });

  } catch (error) {
    console.error("Unhandled error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

