import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const payload = await req.json();
      const { searchParams } = new URL(req.url);
      const action = searchParams.get("action");

      

      const { error } = await supabase
        .from("contactRequest")
        .update({ status: action + "ed" })
        .eq("id", payload.contactRequestId);
      
      if (error) throw error;

      if (action === "accept") {
        const { error } = await supabase.from("contacts").insert(payload);
        
        if (error) throw error;
      }

      return NextResponse.json(
        { msg: "contact requested successfully" },
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
