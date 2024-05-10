import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const userEmail = searchParams.get("userEmail");
      const payOutStatus = searchParams.get("payOutStatus");
      const registrationCompleted = searchParams.get("registrationCompleted");

      console.log(userEmail, userId);

      const query = supabase.from("eventTransactions").select("*");

      if (userId) query.eq("userId", userId);
      if (userEmail) query.eq("events.email", userEmail);
      if (registrationCompleted)
        query.eq(
          "registrationCompleted",
          parseInt(registrationCompleted) === 1 ? true : false
        );
      if (payOutStatus && parseInt(payOutStatus) === 1)
        query.neq("payOutStatus", "new");

      const { data, error, status } = await query;
      console.log(data, error);

      if (error) throw error;

      return NextResponse.json(
        { data },
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
