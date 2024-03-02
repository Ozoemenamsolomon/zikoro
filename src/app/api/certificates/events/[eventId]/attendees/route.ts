import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { eventId } = params;

      const {
        data: certificateData,
        error: certificateError,
        status,
      } = await supabase
        .from("attendeeCertificates")
        .select("*")
        .eq("eventId", eventId);

      console.log(certificateData);

      if (certificateError) throw certificateError;

      const attendeeIds = new Set(
        certificateData.flatMap(({ attendeeId }) => [].concat(attendeeId))
      );

      const { data, error } = await supabase
        .from("attendees")
        .select("*")
        .in("id", Array.from(attendeeIds));

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
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { certificateInfo, attendeeInfo, action } = await req.json();

      let query;

      if (action === "release") {
        query = await supabase.from("attendeeCertificates").upsert(
          attendeeInfo.map((attendee) => {
            const certificateId = createHash();
            return {
              certificateId,
              certificateURL: "www.zikoro.com/verify/" + certificateId,
              ...certificateInfo,
              ...attendee,
            };
          }),
          { onConflict: "id" }
        );
      } else {
        query = await supabase
          .from("attendeeCertificates")
          .delete()
          .eq("CertificateGroupId", certificateInfo.CertificateGroupId)
          .in(
            "attendeeId",
            attendeeInfo.map(({ attendeeId }) => attendeeId)
          );
      }

      const { error } = query;

      if (error) throw error;

      return NextResponse.json(
        {
          data: {
            msg: `certificates ${
              action + (action === "release" ? "d" : "ed")
            } successfully`,
          },
        },
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
