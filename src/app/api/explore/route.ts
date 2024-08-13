import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      let eventsQuery = supabase
        .from("events")
        .select()
        .eq("published", true)
        .eq('explore', true)
        .gte("startDateTime", new Date().toISOString()) // Filter non-expired events

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
