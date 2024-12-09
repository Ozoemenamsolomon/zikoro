import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { certificateAlias: string } }
) {
  const { certificateAlias } = params;
  const { searchParams } = new URL(req.url);
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("certificate")
        .select("*")
        .eq("certificateAlias", certificateAlias)
        .maybeSingle();

      console.log(data, "certificate");

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { certificateAlias: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const { certificateAlias } = params;

      const payload = await req.json();

      console.log(payload);

      const { data, error } = await supabase
        .from("certificate")
        .update(payload)
        .eq("certificateAlias", certificateAlias)
        .select()
        .maybeSingle();

      console.log(data, error);

      if (error) throw error;

      return NextResponse.json(
        { msg: "certificate saved successfully", data },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error("certificate error:", error);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { certificateAlias: string } }
) {
  const { certificateAlias } = params;
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "DELETE") {
    try {
      const { data, error, status } = await supabase
        .from("certificate")
        .delete()
        .eq("certificateAlias", certificateAlias);

      if (error) throw error;

      return NextResponse.json(
        { data },
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
