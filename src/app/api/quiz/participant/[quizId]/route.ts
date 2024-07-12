import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const { quizId } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "DELETE") {
    try {
      

      const { data, error, status } = await supabase
        .from("quizLobby")
        .delete()
        .eq("quizAlias", quizId);

      if (error) {
        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 200,
          }
        )
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

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const { quizId } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      

      const { data, error, status } = await supabase
        .from("quizLobby")
        .select("*")
        .eq("quizAlias", quizId);

      

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