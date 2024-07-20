import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const { eventId } = params;
  if (req.method === "GET") {
    try {
      
      const { data, error, status } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("eventAlias", eventId);

      // eventPartnerAlias partnerAlias 


      
      if (error) {
        return NextResponse.json(
          { error: error?.message },
          {
            status: 400,
          }
        );
      }

      
      if (error) throw error;

      const stampedPartners: any[] = []

     
      if (Array.isArray(data) && data?.length > 0) {
       
            for (let partner of data) {
               
                const { data: leads, error, status } = await supabase
                .from("Leads")
                .select("*")
                .eq("eventPartnerAlias", partner?.partnerAlias)

                stampedPartners?.push({
                    ...partner,
                    leads
                })  
                 
              

                //  if (error) {
                //     return NextResponse.json(
                //       { error: error?.message },
                //       {
                //         status: 400,
                //       }
                //     );
                //   }
            }
      }
     // console.log("stamped data", stampedPartners)

      return NextResponse.json(
        {
          data : stampedPartners,
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
