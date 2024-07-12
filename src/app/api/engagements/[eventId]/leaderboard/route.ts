import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const tables = [
    "attendees",
    "sessionReviews",
    "quizAnswer",
    "Leads",
    "leadsInterests",
  ];

  //   "quizAnswer", "leadsInterests",

  if (req.method === "GET") {
    try {
      const { eventId } = params;

      let scoreData: { [key: string]: any[] } = {
        checkInAttendees: [],
        attendeeProfile: [],
        quizAnswer: [],
        leadsInterests: [],
        sessionReviews: [],
        Leads: [],
      };

      for (let table of tables) {
        const query = supabase
          .from(table)
          .select(table !== "attendees" ? "*, attendees!inner(*)" : "*")
          .eq("eventAlias", eventId);

        const { data, error, status } = await query;

        if (table === "attendees") {
          if (data && data.length > 0) {
            const mappedData = data?.map((item: any) => {
              const { checkInPoints, ...restData } = item;
              return {
                ...restData,
                points: item?.checkInPoints || 0,
              };
            });
            scoreData["checkInAttendees"] = mappedData;
            // console.log(scoreData[table])
          }
          if (data && data.length > 0) {
            const mappedData = data?.map((item: any) => {
              const { attendeeProfilePoints, ...restData } = item;
              return {
                ...restData,
                points: item?.attendeeProfilePoints || 0,
              };
            });
            scoreData["attendeeProfile"] = mappedData;
            // console.log(scoreData[table])
          }
        } else if (table === "quizAnswer") {
          if (data && data.length > 0) {
            const mappedData = data?.map((item: any) => {
              return {
                ...item?.attendees,
                points: item?.attendeePoint || 0,
              };
            });
            scoreData["quizAnswer"] = mappedData;
            // console.log(scoreData[table])
          }
        } else {
          // points
          if (data && data.length > 0) {
            const mappedData = data?.map((item: any) => {
              return {
                ...item?.attendees,
                points: item?.points || 0,
              };
            });
            scoreData[table] = mappedData;
            // console.log(scoreData[table])
          }
        }

        if (error) {
          return NextResponse.json(
            {
              error: error?.message,
            },
            {
              status: 400,
            }
          );
        }
      }

      return NextResponse.json(
        {
          data: scoreData,
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
