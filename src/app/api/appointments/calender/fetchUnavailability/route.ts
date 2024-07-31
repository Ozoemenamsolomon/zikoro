
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  if ( !userId  ) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('appointmentUnavailability')
      .select('*')
      .eq("createdBy", userId)

    if (error) {
      console.error("Error fetching unavailability schedules:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    else if (data.length === 0) {
      console.log("No matching records found or 'createdBy' field does not exist.", error);
      return NextResponse.json({ error: 'No data found for user'}, { status: 400 });
    } 
    console.log({  userId,error,data})
    return NextResponse.json({ data, count:data?.length }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}





// import { formatAppointmentsByMonth, formatAppointmentsByWeek } from "@/lib";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { startOfDay, endOfDay } from "date-fns";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });

//   if (req.method !== "GET") {
//     return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
//   }

//   const { searchParams } = new URL(req.url);
//   const view = searchParams.get('view'); // 'month' or 'week'
//   const startDate = searchParams.get('startDate');
//   const endDate = searchParams.get('endDate');
//   const userId = searchParams.get('userId');

//   if (!startDate || !endDate || !userId || !view) {
//     return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
//   }

//   try {
    
//     const { data, error } = await supabase
//       .from('bookings')
//       .select('*, appointmentLinkId(*, createdBy(userEmail, organization, firstName, lastName, phoneNumber))')
//       .eq("createdBy", userId)
//       .gte('appointmentDate', startOfDay(new Date(startDate)).toISOString())
//       .lte('appointmentDate', endOfDay(new Date(endDate)).toISOString());

//     if (error) {
//       console.error("Error fetching bookings:", error.message);
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }
//     let appointments: Record<string, any> = {}; 
    
//     // Format the data based on the view
//     if (view === 'month') {
//       appointments = formatAppointmentsByMonth(data);
//     } else if (view === 'week') {
//       appointments = formatAppointmentsByWeek(data);
//     }
    
//     console.log({view,startDate,endDate,userId,error,appointments})
//     return NextResponse.json({ appointments, count:data?.length }, { status: 200 });
//   } catch (error) {
//     console.error("Unhandled error:", error);
//     return NextResponse.json(
//       { error: "An error occurred while processing the request" },
//       { status: 500 }
//     );
//   }
// }
