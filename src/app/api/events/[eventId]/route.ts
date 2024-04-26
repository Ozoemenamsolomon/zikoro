import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { data, error: checkIfRegisteredError } = await supabase
        .from("events")
        .select("*")
        .eq("email", params.email)
        .eq("eventId", params.eventId)
        .maybeSingle();

      if (checkIfRegisteredError) throw checkIfRegisteredError?.code;
      if (data) throw "email error";

      const { error } = await supabase.from("attendees").insert(params);
      if (error) throw error.code;

      return NextResponse.json(
        { msg: "attendee created successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error:
            error === "email error"
              ? "Email already registered for this event"
              : "An error occurred while making the request.",
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

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const { error } = await supabase
        .from("events")
        .upsert(params, { onConflict: "id" });
      if (error) throw error;
      return NextResponse.json(
        { msg: "event updated successfully" },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error, "patch");
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
  { params }: { params: { eventId: number } }
) {
  const { eventId } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const isAlias = searchParams.get("isAlias");

      console.log(isAlias, eventId);

      const { data, error, status } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq(isAlias === "1" ? "eventAlias" : "id", eventId)
        .maybeSingle();

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
