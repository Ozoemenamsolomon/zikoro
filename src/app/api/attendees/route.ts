import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const params = await req.json();
      const supabase = createRouteHandlerClient({ cookies });

      const { error } = await supabase.from("profiles").upsert(params);
      if (error) throw error;
      return NextResponse.json({
        data: { msg: "hello world" },
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        error: "An error occurred while making the request.",
        status: 500,
      });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export const dynamic = "force-dynamic";
