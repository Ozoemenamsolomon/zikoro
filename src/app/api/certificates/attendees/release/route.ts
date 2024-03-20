import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createHash } from "@/utils/helpers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "POST") {
    try {
      const params = await req.json();
      const certificateId = createHash(JSON.stringify(params));
      const body = {
        ...params,
        certificateId,
        certificateURL: "www.zikoro.com/verify/" + certificateId,
      };

      console.log(body);

      const { data, error } = await supabase
        .from("attendeeCertificates")
        .insert(body)
        .select()
        .maybeSingle();
      if (error) throw error;

      return NextResponse.json(
        { msg: "certificate released successfully", data },
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
