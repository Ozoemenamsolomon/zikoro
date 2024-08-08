import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();
      const { sessionAlias: alias } = params;

      const {
        data: allMyAgendas,
        error: fetchError,
        status,
      } = await supabase.from("myAgenda").select("*");

      if (
        Array.isArray(allMyAgendas) &&
        allMyAgendas?.some(({ sessionAlias }) => sessionAlias === alias)
      ) {
        const { error: deleteError } = await supabase
          .from("myAgenda")
          .delete()
          .eq("sessionAlias", alias);

        if (deleteError) {
          return NextResponse.json(
            { error: deleteError.message },
            {
              status: 400,
            }
          );
        }
      } else {
        const { error } = await supabase.from("myAgenda").upsert(params);

        if (error) {
          return NextResponse.json(
            { error: error.message },
            {
              status: 400,
            }
          );
        }
        if (error) throw error;
      }

      return NextResponse.json(
        { msg: "Agenda added successfully" },
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
      const { data, error, status } = await supabase
        .from("myAgenda")
        .select("*");

      // 

      if (error) {
        return NextResponse.json(
          {
            error,
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
