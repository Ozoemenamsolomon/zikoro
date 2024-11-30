import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { userId } = params;
      const payload = await req.json();

      const { error } = await supabase
        .from("favouriteContact")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      return NextResponse.json(
        { msg: "favourites updated successfully" },
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

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { userId } = params;
      const searchParams = req.nextUrl.searchParams;
      const eventId = searchParams.get("eventId");
      if (!eventId) throw new Error("Event id is required");

      console.log(eventId);

      const { data, error, status } = await supabase
        .from("favouriteContact")
        .select("*")
        .eq("userId", userId)
        .eq("eventId", eventId)
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

export const dynamic = "force-dynamic";
