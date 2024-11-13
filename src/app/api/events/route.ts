import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const organisationId = searchParams.get("organisationId");

      const query = supabase.from("events").select("*, organization!inner(*), attendees!inner(*)").range(0,10000);

      if (userId) query.eq("createdBy", userId);
      if (organisationId) query.eq("organisationId", organisationId);

      const { data, error, status } = await query;

      if (data) {
        data.forEach(event => {
          if (event.attendees && !Array.isArray(event.attendees)) {
            event.attendees = [event.attendees]; 
          }
        });
      }

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

export const dynamic = "force-dynamic";
