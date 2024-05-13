import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createHash } from "@/utils/helpers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "POST") {
    try {
      const params = await req.json();
      const badgeId = createHash(JSON.stringify(params));
      const body = {
        ...params,
        badgeId,
        badgeURL: "www.zikoro.com/badge/" + badgeId,
      };

      console.log(body);

      const { data, error } = await supabase
        .from("attendeeBadges")
        .insert(body)
        .select()
        .maybeSingle();
      if (error) throw error;

      return NextResponse.json(
        { msg: "badge released successfully", data },
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
