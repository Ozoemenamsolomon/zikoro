import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Event, TOrganization } from "@/types";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { searchParams } = new URL(req.url);
      const trackingId = searchParams.get("trackingId");

      const { error } = await supabase
        .from("attendeeEmailInvites")
        .update({ response: "not attending" })
        .eq("trackingId", trackingId);

      if (error) throw error;
      return NextResponse.redirect("/");
      //   return NextResponse.json(
      //     { msg: "invites sent successfully" },
      //     {
      //       status: 201,
      //     }
      //   );
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
