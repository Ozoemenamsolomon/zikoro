import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { attendeeId: string } }
) {
  console.log(params, "params");
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      //   const { attendeeId } = params;
      const payload = await req.json();

      console.log(payload, "payload");

      const { error } = await supabase
        .from("attendeeTags")
        .upsert(payload, { onConflict: "id" });

      console.log(error, "error");
      if (error) throw error;
      return NextResponse.json(
        { msg: "tags updated successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error, "error");
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
  { params }: { params: { attendeeId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { attendeeId } = params;

      const { data, error, status } = await supabase
        .from("attendeeTags")
        .select("*")
        .eq("attendeeId", attendeeId)
        .maybeSingle();

      if (error) throw error;

      console.log(data);

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
