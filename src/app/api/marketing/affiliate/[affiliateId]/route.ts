import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { affiliateId: number } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { affiliateId } = params;
      const { data, error, status } = await supabase
        .from("affiliate")
        .select("*")
        .eq("id", affiliateId);

      if (error) throw error;

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

export async function POST(
  req: NextRequest,
  { params }: { params: { affiliateId: number } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { affiliateId } = params;
      console.log(params);
      const payload = await req.json();

      const { error } = await supabase
        .from("affiliate")
        .update(payload)
        .eq("id", affiliateId);

      if (error) throw error;
      return NextResponse.json(
        { msg: "affiliate updated successfully" },
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
          status: 400,
        }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Method not allowed" },
      {
        status: 500,
      }
    );
  }
}

export const dynamic = "force-dynamic";
