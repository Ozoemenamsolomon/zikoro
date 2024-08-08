import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";
import { TAffiliate } from "@/types";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const organizationId = searchParams.get("organizationId");

      console.log(organizationId);

      const query = supabase.from("affiliate").select("*");

      if (userId) query.eq("userId", userId);

      if (organizationId) query.eq("organizationId", organizationId);

      const { data, error, status } = await query;

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

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const payload = (await req.json()) as TAffiliate;

      const { error } = await supabase.from("affiliate").upsert(payload);

      if (error) throw error;
      return NextResponse.json(
        { msg: "affiliate created successfully" },
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
