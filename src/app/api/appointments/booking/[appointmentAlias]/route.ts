import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { appointmentAlias: string } }
) {
  const { appointmentAlias } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("appointmentLinks")
        .select(`*, createdBy(userEmail,id,profilePicture,organization,firstName,lastName,phoneNumber)`)
        .eq("appointmentAlias", appointmentAlias)
        .single();
        console.log({data,error,appointmentAlias})
      if (error) {
        throw NextResponse.json({ error: error.message }, { status: 400 });
      }

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
