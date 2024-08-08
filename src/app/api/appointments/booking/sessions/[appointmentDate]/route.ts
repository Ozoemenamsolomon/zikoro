import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { appointmentDate: string } }
) {
  const { appointmentDate } = params;

  // Parse the query parameters from the URL
  const url = new URL(req.url);
  const appointmentLinkId = url.searchParams.get("appointmentLinkId");

  const supabase = createRouteHandlerClient({ cookies });
  // FETCH bookings excluding 'CANCELLED' bookings.
  try {
    const { data, error, status } = await supabase
      .from("bookings")
      .select("*")
      .eq("appointmentDate", appointmentDate)
      .eq("appointmentLinkId", appointmentLinkId)
      .neq("bookingStatus", 'CANCELLED')
      .order('created_at', { ascending: false });

    console.log({ data, error, appointmentDate, appointmentLinkId });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      {
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "An error occurred while making the request.",
      },
      {
        status: 500,
      }
    );
  }
}

export const dynamic = "force-dynamic";


// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { appointmentDate: string } }
// ) {
//   const { appointmentDate } = params;
//   const { appointmentLinkId } = await req.json();

//   const supabase = createRouteHandlerClient({ cookies });

//   if (req.method === "GET") {

//     const {appointmentLinkId} = await req.query
//     try {
//       const { data, error, status } = await supabase
//         .from("bookings")
//         .select("*")
//         .eq("appointmentDate", appointmentDate)
//         .eq("appointmentLinkId", appointmentLinkId)
//         .order('created_at', {ascending:false})

//         console.log({data,error,appointmentDate,appointmentLinkId})
//       if (error) {
//         throw NextResponse.json({ error: error.message }, { status: 400 });
//       }

//       return NextResponse.json(
//         {
//           data,
//         },
//         {
//           status: 200,
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json(
//         {
//           error: "An error occurred while making the request.",
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   } else {
//     return NextResponse.json({ error: "Method not allowed" });
//   }
// }

// export const dynamic = "force-dynamic";


