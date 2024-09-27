import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const eventId = searchParams.get("eventId");

      const query = supabase.from("badgeNew").select("*");
      // .select("*, event:events!inner(*, organization!inner(*))");

      // if (eventId) query.eq("eventAlias", eventId);

      const { data, error, status } = await query;

      console.log(data, error, "badges");

      if (error) throw error;

      return NextResponse.json(
        { data, statusText: "this is status text", error },
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
      const badgeAlias = generateAlphanumericHash(12);

      const { data, error } = await supabase
        .from("badgeNew")
        .insert({ badgeAlias })
        .select()
        .maybeSingle();

      console.log(data, error);

      if (error) throw error;

      return NextResponse.json(
        { msg: "badge saved successfully", data },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error("badge error:", error);
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
