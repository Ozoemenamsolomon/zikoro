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

        let transactions = []
      const query = supabase.from("eventTransactions")
      .select("*")
      .range(Number(from || 0), Number(to || 50));
      if (eventAlias && eventAlias?.length > 0) {
        query.eq("eventAlias", eventAlias);
      }
     


      const { data, error, status } = await query;

      if(data) {
        transactions=   await Promise.all(
            data?.map( async (trans) => {
                const { data: fetchedAttendees, error: errorFetchingAttendee } =
                await supabase
                  .from("attendees")
                  .select("*")
                  .eq("eventRegistrationRef", trans?.eventRegistrationRef);

                  if (errorFetchingAttendee) {
                    console.error(
                      `Failed to fetch attendees for transaction`
                    );
                    return { ...trans, attendeesDetails: [] };
                  }
      
                  return { ...trans, attendeesDetails: fetchedAttendees };
            })
        )

    
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
          data: transactions,
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
