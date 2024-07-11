import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });


  const tables = [
    "attendees",
    "sessionReviews",
    "eventPartners",
    "quizAnswer",
    "leadsInterests",
    "Leads"

  ]

  if (req.method === "GET") {
    try {
      const { eventId } = params;


    for (let table of tables) {
        const query = supabase
        .from(table)
        .select("*")
        .eq("eventAlias", eventId)
      

      const { data, error, status } = await query;

    

      if (error) {
        return NextResponse.json(
          {
            error: error?.message,
          },
          {
            status: 400,
          }
        );
      }
    }

     

      return NextResponse.json(
        {
          data:"",
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
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}
