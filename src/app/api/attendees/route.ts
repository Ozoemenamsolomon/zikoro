import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    console.log("here");
    try {
      const params = await req.json();

      console.log(params);
      console.log(params.id);

      if (!params.id) {
        const { data, error: checkIfRegisteredError } = await supabase
          .from("attendees")
          .select("*")
          .eq("email", params.email)
          .eq("eventAlias", params.eventId)
          .maybeSingle();

        console.log(checkIfRegisteredError, data);

        if (checkIfRegisteredError) throw checkIfRegisteredError?.code;
        if (data) throw "email error";
      }

      const { error } = await supabase
        .from("attendees")
        .upsert({ ...params, eventAlias: params.eventId });

      if (error) {
        console.log(error);
        throw error.code;
      }

      const { data: event, error: eventSelectError } = await supabase
        .from("events")
        .select("registered")
        .eq("eventAlias", params.eventId)
        .maybeSingle();

      if (eventSelectError || !event) {
        console.log(eventSelectError);
        throw eventSelectError.code;
      }

      console.log(event.registered);

      const { error: eventError } = await supabase
        .from("events")
        .update({ registered: event.registered + 1 })
        .eq("eventAlias", params.eventId);

      if (eventError) throw eventError.code;

      return NextResponse.json(
        { msg: "attendee created successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error, "error");
      return NextResponse.json(
        {
          err: JSON.stringify(error),
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
        .from("attendees")
        .upsert(params, { onConflict: "id" });
      if (error) throw error;
      return NextResponse.json(
        { msg: "attendees updated successfully" },
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    console.log(eventId);
    try {
      const query = supabase
        .from("attendees")
        .select("*")
        .order("registrationDate", { ascending: false });

      console.log(eventId);

      if (eventId) query.eq("eventAlias", eventId);
      if (userId) query.eq("userId", userId);

      const { data, error, status } = await query;

      console.log(data);

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
