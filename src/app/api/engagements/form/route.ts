import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { error } = await supabase.from("forms").upsert(params);

      if (error) {
        return NextResponse.json(
          { error: error?.message },
          {
            status: 400,
          }
        );
      }
      if (error) throw error;

      if (
        typeof params.formSettings.connectedEngagementId === "string" &&
        params.formSettings.connectedEngagementId.length > 0
      ) {
        const { error: engagementFetchError, data } = await supabase
          .from("quiz")
          .select("*")
          .eq("quizAlias", params.formSettings.connectedEngagementId)
          .single();

        if (engagementFetchError) {
          return NextResponse.json(
            {
              error: engagementFetchError.message,
            },
            {
              status: 400,
            }
          );
        }

        if (engagementFetchError) throw error;

        if (data && !data?.formAlias) {
          const payload = {
            ...data,
            formAlias: params.formSettings.connectedEngagementId,
          };
          const { error: upateError } = await supabase
            .from("quiz")
            .upsert(payload);

          if (upateError) {
            return NextResponse.json(
              {
                error: upateError.message,
              },
              {
                status: 400,
              }
            );
          }

          if (upateError) throw error;
        }
      }

      return NextResponse.json(
        { msg: "Form Created Successfully" },
        {
          status: 200,
        }
      );
    } catch (error) {
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("forms").select("*");

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
