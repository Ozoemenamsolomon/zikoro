import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
    if (req.method === "POST") {
      try {
        const params = await req.json();
  
        const { error } = await supabase.from("redeemedRewards").upsert(params);
  
        if (error) {
          return NextResponse.json(
            { error: error.message },
            {
              status: 400,
            }
          );
        }
  
        return NextResponse.json(
          { msg: "Reward redeemed successfully" },
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


export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: number } }
) {
  const { eventId } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      

      const { data, error, status } = await supabase
        .from("redeemedRewards")
        .select("*")
        .eq("eventAlias", eventId);

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
          data,
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