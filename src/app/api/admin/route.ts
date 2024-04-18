import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type AdminRequestBody = {
  adminId: number;
};

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    const body = (await req.json()) as AdminRequestBody | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    const { adminId } = body;
    try {
      const { data, error } = await supabase
        .from("blog")
        .select()
        .eq("id", adminId);

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
