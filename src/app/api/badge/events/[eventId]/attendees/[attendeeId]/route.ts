import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// export async function POST(req: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });
//   if (req.method === "POST") {
//     try {
//       const params = await req.json();

//       const { error } = await supabase
//         .from("attendeebadge")
//         .upsert(params, { onConflict: "id" });
//       if (error) throw error;
//       return NextResponse.json(
//         { msg: "note created successfully" },
//         {
//           status: 201,
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

export async function GET(
  req: NextRequest,
  { params }: { params: { attendeeId: number; eventId: number } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { attendeeId, eventId } = params;
      const { data, error, status } = await supabase
        .from("attendeeBadge")
        .select("*")
        .eq("attendeeId", attendeeId)
        .eq("eventAlias", eventId)
        .maybeSingle();

      if (error) throw error;

      return NextResponse.json(
        { data },
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
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: number; attendeeId: number } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { eventId, attendeeId } = params;
      const body = await req.json();
      const { badgeIds } = body;
      console.log(badgeIds, "badgeIds");

      const { error } = await supabase
        .from("attendeeBadge")
        .delete()
        .eq("attendeeId", attendeeId)
        .eq("eventAlias", eventId)
        .in("BadgeGroupId", badgeIds);

      if (error) throw error;

      return NextResponse.json(
        {
          data: {
            msg: "badges recalled successfully",
          },
        },
        {
          status: 201,
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
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export const dynamic = "force-dynamic";
