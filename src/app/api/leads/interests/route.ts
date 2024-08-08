import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const {
        data,
        error: fetchError,
        status,
      } = await supabase.from("LeadsInterests").select("*");

      console.log(data);

      if (fetchError) {
        return NextResponse.json(
          { error: fetchError.message },
          {
            status: 400,
          }
        );
      }
      //  console.log("daaa", data)
      let leads = [];
      if (data?.length === 0) {
        leads = params;
      } else {
        const isPartnerPresent = data?.some(
          (lead) => lead?.eventPartnerAlias === params?.eventPartnerAlias
        );
        if (isPartnerPresent) {
          // all partner leads
          const allPartnerLeads = data?.filter(
            (lead) => lead?.eventPartnerAlias === params?.eventPartnerAlias
          );
          const remainingLeads = data?.filter(
            (lead) => lead?.eventPartnerAlias !== params?.eventPartnerAlias
          );
          // check attendee in partnerlist
          const isPresent = allPartnerLeads?.some(
            (lead) => lead?.attendeeId === params?.attendeeId
          );
          // if partner is present, check the attendee has applied for any of their job or offer
          if (isPresent) {
            const mappedArray = allPartnerLeads?.map((lead) => {
              if (lead?.attendeeId === params?.attendeeId) {
                return {
                  ...lead,
                  interests: [...lead?.interests, ...params?.interests],
                };
              }

              return { ...lead };
            });

            leads = [...mappedArray, ...remainingLeads];
          } else {
            // append appendee if not applied
            leads = { ...params, createdAt: new Date().toISOString() };
          }
        } else {
          // add attendee to the new partner, if the partner is not present
          leads = { ...params, createdAt: new Date().toISOString() };
        }
      }

      // console.log("leads", leads)

      const { error } = await supabase.from("Leads").upsert(leads);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json(
        { msg: "Leads created successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: error,
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const eventPartnerAlias = searchParams.get("eventPartnerAlias");
      const interestType = searchParams.get("interestType");
      //   const attendeeId = searchParams.get("attendeeId");
      const query = supabase
        .from("leadsInterests")
        .select("*")
        .eq("eventPartnerAlias", eventPartnerAlias);

      if (interestType) query.eq("interestType", interestType);

      const { data, error, status } = await query;

      console.log(data);

      if (error) throw error;

      console.log(data);

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
