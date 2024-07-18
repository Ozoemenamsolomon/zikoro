import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { formatReviewNumber } from "@/utils";
export async function GET(
  req: NextRequest,
  { params }: { params: { agendaId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    const { agendaId } = params;

    try {
      const { data, error } = await supabase
        .from("sessionReviews")
        .select("*")
        .eq("sessionAlias", agendaId)


      // 
      let ratingCount = 0

      if ( !data || (Array.isArray(data) && data?.length === 0) ) {

        ratingCount = 0
      }
      else if (Array.isArray(data) && data?.length > 0) {
        const mappedReviews = data?.map((item) => Number(item?.rating))
        ratingCount = mappedReviews?.reduce((a, b) => a + b, 0)
       
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
          data: formatReviewNumber(ratingCount), reviews: data
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
