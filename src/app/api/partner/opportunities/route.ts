import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type");

      const { error, data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("partnerAlias", params?.partnerId)
        .single();

        console.log('payload',params)
      if (error) {
        return NextResponse.json(
          { error: error.message },
          {
            status: 400,
          }
        );
      }
      
      if (error) throw error;

      let payload = data;

      //console.log("res", data)
      if (type === "job") {
        payload = {
          ...payload,
          jobs:
            Array.isArray(payload?.jobs) && payload?.jobs?.length > 0
              ? [
                  ...payload?.jobs?.filter((v: any) => v?.id !== params?.id),
                  { ...params },
                ]
              : [{ ...params }],
        };
      } else if (type === "offer") {
        payload = {
          ...payload,
          offers:
            Array.isArray(payload?.offers) && payload?.offers?.length > 0
              ? [
                  ...payload?.offers?.filter((v: any) => v?.id !== params?.id),
                  { ...params },
                ]
              : [{ ...params }],
        };
      }

      const { error: fetchError, data: responseData } = await supabase
        .from("eventPartners")
        .upsert(payload);

        if (fetchError) {
          return NextResponse.json(
            { error: fetchError.message },
            {
              status: 400,
            }
          );
        }
        if (fetchError) throw fetchError;
      return NextResponse.json(
        { msg: "Partner updated successfully" },
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
