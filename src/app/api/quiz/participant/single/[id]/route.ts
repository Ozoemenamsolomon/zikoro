import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "DELETE") {
    try {
      

      const { data, error, status } = await supabase
        .from("quizLobby")
        .delete()
        .eq("quizParticipantId", id);

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



export const dynamic = "force-dynamic";
