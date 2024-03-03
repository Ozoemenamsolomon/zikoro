import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { userId } = params;

      const { data: favouriteAttendees, error: firstError } = await supabase
        .from("favouriteContact")
        .select("attendees")
        .eq("userId", userId);

      console.log(favouriteAttendees);

      if (firstError) throw firstError;

      const attendeeIds = favouriteAttendees.map(({ attendees }) => attendees);

      const { data: attendees, error: secondError } = await supabase
        .from("attendees")
        .select("*")
        .in("id", attendeeIds);

      if (secondError) throw secondError;

      return NextResponse.json(
        { data: attendees },
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

export const dynamic = "force-dynamic";
