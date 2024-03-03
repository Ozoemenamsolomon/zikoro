import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
