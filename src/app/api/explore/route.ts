import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    // Get the query parameters from the request
    const { searchParams } = new URL(req.url);
    const eventCity = searchParams.get("eventCity");    

    try {
      let eventsQuery = supabase
        .from("events")
        .select()
        .eq("published", true)
        .limit(4);

      // If query parameters are provided, apply filters
      if (eventCity) {
        eventsQuery = eventsQuery.eq("eventCity", eventCity);
      }

      // Fetch data from Superbase table 'events' based on query parameters
      const { data, error } = await eventsQuery;

      if (error) throw error;

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
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}
