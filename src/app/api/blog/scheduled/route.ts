import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
  
    if (req.method === "GET") {
      try {
        const { data, error, } = await supabase
        .from('blog')
        .select()
        .eq( 'status', 'schedule' )
  
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