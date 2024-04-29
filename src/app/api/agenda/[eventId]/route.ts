import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface TAgenda {
  sessionTitle: string;
  id: number;
  eventAlias: string;
  created_at: string;
  activity: string;
  startDateTime: string;
  endDateTime: string;
  Track: string;
  sessionType: string;
  description:string;
  sessionVenue: string;
  sessionUrl: string;
  sessionSpeakers: any[];
  sessionModerators: any[];
  sessionSponsors: any[];
  sessionFiles: any[];
  sessionViews: number;
  sessionViewsDetails: any[];
  sessionCheckin: string;
  sessionCheckinDetails: JSON;
  eventId: string;
}

interface TSessionAgenda {
  timeStamp: { start: string; end: string };
  sessions: TAgenda[];
}
export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    const { eventId } = params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const query = searchParams.get("query");

    try {
      const { data: agendas, error } = await supabase
        .from("agenda")
        .select("*")
        .eq("eventAlias", eventId);

      // console.log(data);

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

      if (error) throw error;

      const { data: myAgendas, error: myAgendaFetchError } = await supabase
        .from("myAgenda")
        .select("*");

      if (myAgendaFetchError) {
        return NextResponse.json(
          {
            error: myAgendaFetchError?.message,
          },
          {
            status: 400,
          }
        );
      }

      const { data: event, error: eventFetchError } = await supabase
        .from("events")
        .select("*")
        .eq("eventAlias", eventId)
        .single();

      if (eventFetchError) {
        return NextResponse.json(
          {
            error: eventFetchError?.message,
          },
          {
            status: 400,
          }
        );
      }

      const formattedAgendas = agendas?.filter(({ id }) => {
        return myAgendas?.some(
          ({ sessionId }) => Number(sessionId) === Number(id)
        );
      });

      const toFilterArray = query === "my-agenda" ? formattedAgendas : agendas;

      const activeDate = date || event?.startDateTime;
      const filteredAgenda = toFilterArray?.filter(
        ({ startDateTime }) =>
          startDateTime?.split("T")[0] === activeDate?.split("T")[0]
      );

      const sortedAgenda = filteredAgenda.sort((a, b) => {
        const dateA = new Date(a.startDateTime);
        const dateB = new Date(b.startDateTime);
        return dateA.getTime() - dateB.getTime();
      });

      const agendaGroups: { [key: string]: TSessionAgenda } = {};

      sortedAgenda?.forEach((agenda) => {
        const key = `${agenda.startDateTime}-${agenda.endDateTime}`;
        if (!agendaGroups[key]) {
          agendaGroups[key] = {
            timeStamp: {
              start: agenda.startDateTime,
              end: agenda.endDateTime,
            },
            sessions: [],
          };
        }

        agendaGroups[key].sessions.push(agenda);
      });

      const result = Object.values(agendaGroups);
      return NextResponse.json(
        {
          data: result,
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

export const dynamic = "force-dynamic";
