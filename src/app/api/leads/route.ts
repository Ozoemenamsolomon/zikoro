import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { interests, ...restData } = params;
      const leads = {
        ...restData,
        createdAt: new Date().toISOString(),
      };

      const {
        data,
        error: fetchError,
        status,
      } = await supabase.from("Leads").select("*");

      if (fetchError) {
        return NextResponse.json(
          { error: fetchError.message },
          {
            status: 400,
          }
        );
      }

      const { data: leadsInterset, error: fetchLeadInterestError } =
        await supabase.from("leadsInterests").select("*");
      //  console.log("daaa", data)

      if (fetchLeadInterestError) {
        return NextResponse.json(
          { error: fetchLeadInterestError.message },
          {
            status: 400,
          }
        );
      }

      const isAttendeeInPartner = data?.some(
        ({ attendeeAlias, eventPartnerAlias }) =>
          eventPartnerAlias === leads?.eventPartnerAlias &&
          attendeeAlias === leads?.attendeeAlias
      );

      // post to leadsinterset only if an applicant already has his detail with a partner
      if (isAttendeeInPartner) {
        // dont't post if an applicant has already applied for a particular job or promo before.
        const isAlreadyApplied = leadsInterset?.some(
          ({ partnerInterestId }) =>
            partnerInterestId === interests?.partnerInterestId
        );
        if (isAlreadyApplied) {
          //   console.log("in alredy appleid")
          return NextResponse.json(
            { error: "You already applied for this job or offer" },
            {
              status: 400,
            }
          );
        }
        const { error } = await supabase
          .from("leadsInterests")
          .upsert(interests);
        ///  console.log("in appleid")
        if (error) {
          return NextResponse.json(
            { error: error.message },
            {
              status: 400,
            }
          );
        }
      } else {
        // post to leads and leadsinterest if they are empty
        //  console.log(" appleid")
        // post to leadsinterset and leads if an applicant does not have his detail with a partner
        const { error: leadsError } = await supabase
          .from("Leads")
          .upsert(leads);

        if (leadsError) {
          return NextResponse.json(
            { error: leadsError.message },
            {
              status: 400,
            }
          );
        }

        const { error: interestsError } = await supabase
          .from("leadsInterests")
          .upsert(interests);

        if (interestsError) {
          return NextResponse.json(
            { error: interestsError.message },
            {
              status: 400,
            }
          );
        }
      }

      // console.log("leads", leads)

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
      const eventAlias = searchParams.get("eventAlias");
      const partnerId = searchParams.get("partnerId");

      const query = supabase
        .from("Leads")
        .select("*")
        .eq("eventAlias", eventAlias);

      if (partnerId) query.eq("eventPartnerAlias", partnerId);

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
