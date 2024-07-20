import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToICSFormat, generateQRCode } from "../payment/route";
import { Event, TOrganization } from "@/types";
import { uploadFile } from "@/utils";
import { format } from "date-fns";

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    try {
      const query = supabase
        .from("attendees")
        .select("*")
        .order("registrationDate", { ascending: false })
        .eq("email", email);

      if (eventId) query.eq("eventAlias", eventId);
      if (userId) query.eq("userId", userId);

      query.limit(1);

      const { data, error, status } = await query;

      if (error) throw error;

      return NextResponse.json(
        {
          data: data[0],
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
