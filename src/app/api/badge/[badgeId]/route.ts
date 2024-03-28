import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { badgeId: string } }
) {
  const { badgeId } = params;
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("badge")
        .select("*")
        .eq("id", badgeId)
        .maybeSingle();

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { badgeId: string } }
) {
  const { badgeId } = params;
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "DELETE") {
    try {
      console.log(badgeId, "backedn delte");
      const { data, error, status } = await supabase
        .from("badge")
        .delete()
        .eq("id", badgeId);

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
