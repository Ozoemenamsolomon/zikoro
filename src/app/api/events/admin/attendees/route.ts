import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);

      const from = searchParams.get("from");
      const to = searchParams.get("to");
      const eventAlias = searchParams.get("eventAlias");

      let transactions = [];
      let totalPages = 0;
      const query = supabase
        .from("eventTransactions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(Number(from || 0), Number(to || 50));
      if (eventAlias && eventAlias?.length > 0) {
        query.eq("eventAlias", eventAlias);
      }

      const { data, error, status, count } = await query;

      if (data) {
        if (data?.length > 0 && count) totalPages = Math.ceil(count / 50);
        const updatedWithAttendees = await Promise.all(
          data?.map(async (trans) => {
            const { data: fetchedAttendees, error: errorFetchingAttendee } =
              await supabase
                .from("attendees")
                .select("*")
                .eq("eventRegistrationRef", trans?.eventRegistrationRef);

            if (errorFetchingAttendee) {
              console.error(`Failed to fetch attendees for transaction`);
              return { ...trans, attendeesDetails: [] };
            }

            return { ...trans, attendeesDetails: fetchedAttendees };
          })
        );
        transactions = await Promise.all(
          updatedWithAttendees?.map(async (trans) => {
            const { data: fetchedEvent, error: errorFetchingEvent } =
              await supabase
                .from("events")
                .select("* , organization!inner(*)")
                .eq("eventAlias", trans?.eventAlias)
                .single();

            if (errorFetchingEvent) {
              console.error(`Failed to fetch`);
              return { ...trans, eventData: null };
            }

            return { ...trans, eventData: fetchedEvent };
          })
        );
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

      if (error) throw error;

      return NextResponse.json(
        {
          data: { transactions, totalPages },
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
