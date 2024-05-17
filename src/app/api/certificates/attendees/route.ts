import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const certificateGroupId = searchParams.get("certificateGroupId");
      const certificateId = searchParams.get("certificateId");

      

      const query = supabase
        .from("attendeeCertificates")
        .select(
          "*, certificate!inner(*, event:events!inner(organization:organization!inner(*))), attendee:attendees!inner(*)"
        );

      if (certificateGroupId)
        query.eq("CertificateGroupId", certificateGroupId);

      if (certificateId) query.eq("certificateId", certificateId).maybeSingle();

      const { data, error } = await query;

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

export const dynamic = "force-dynamic";
