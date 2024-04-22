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

      const { data, error } = await supabase
        .from("events")
        .select("id")
        .eq("createdBy", userId);

      if (error) throw error;

      const { data: secondData, error: secondError } = await supabase
        .from("eventTransactions")
        .select("*, events!inner(*)")
        .in(
          "eventId",
          data.map(({ id }) => id)
        );

      if (secondError) throw secondError;

      return NextResponse.json(
        { data: secondData },
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
