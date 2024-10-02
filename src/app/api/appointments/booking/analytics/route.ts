import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
    
  try {
    const url = new URL(req.url);
    const curStart = url.searchParams.get("curStart");
    const curEnd = url.searchParams.get("curEnd");
    const prevStart = url.searchParams.get("prevStart");
    const prevEnd = url.searchParams.get("prevEnd");
    const userId = url.searchParams.get('userId');
  // console.log({curStart,curEnd,prevStart,prevEnd,userId})

    if (!userId || !curStart || !curEnd || !prevStart || !prevEnd) {
      return NextResponse.json(
        { error: 'Missing required date parameters' },
        { status: 400 }
      );
    }

    const { data: curList, error: curErr } = await supabase
      .from('bookings')
      .select('*, appointmentLinkId(id,appointmentName,brandColour,amount, locationDetails)')
      .eq("createdBy", userId)
      .gte('appointmentDate', curStart)
      .lte('appointmentDate', curEnd);

    if (curErr) {
      console.error(curErr);
      return NextResponse.json(
        { error: curErr.message },
        { status: 500 }
      );
    }

    const { data: prevList, error: prevErr } = await supabase
      .from('bookings')
      .select('*, appointmentLinkId(id,appointmentName,brandColour,amount, locationDetails)')
      .gte('appointmentDate', prevStart)
      .lte('appointmentDate', prevEnd);

    if (prevErr) {
      console.error(prevErr);
      return NextResponse.json(
        { error: prevErr.message },
        { status: 500 }
      );
    }
// console.log({curList,prevList, curErr,prevErr})
    return NextResponse.json(
      { cur: curList, prev: prevList },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
