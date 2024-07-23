import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const payload = await req.json();

      const { error } = await supabase
        .from("contactRequest")
        .insert({ ...payload, status: "pending" });
      
      if (error) throw error;
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userEmail = searchParams.get("userEmail");

      const query = supabase
        .from("contactRequest")
        .select("*")
        .or(`receiverUserEmail.eq.${userEmail},senderUserEmail.eq.${userEmail}`)
        // .eq("status", "pending");

      const { data, error, status } = await query;      

      if (error) throw error;

      const mappedData = await Promise.all(
        data.map(async (item) => {
          const { data: senderData, error: senderError } = await supabase
            .from("users")
            .select("*")
            .eq("userEmail", item.senderUserEmail)
            .maybeSingle();

          if (senderError) throw senderError;

          return { ...item, sender: senderData };
        })
      );

      

      return NextResponse.json(
        { data: mappedData },
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
