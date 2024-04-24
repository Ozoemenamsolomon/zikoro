import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const eventId = searchParams.get("eventId");
      console.log(eventId);

      const query = supabase.from("certificate").select("*");

      if (eventId) query.eq("eventId", eventId);

      const { data, error, status } = await query;
      console.log(data);

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

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      console.log(params);

      const { data, error } = await supabase
        .from("certificate")
        .upsert(params)
        .select()
        .maybeSingle();
      if (error) throw error;

      return NextResponse.json(
        { msg: "certificate saved successfully", data },
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
