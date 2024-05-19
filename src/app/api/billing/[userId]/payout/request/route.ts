import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { userId } = params;
      const payload = await req.json();

      const payOutRef = "ZKR-" + generateAlphanumericHash(12);

      const { error } = await supabase
        .from("eventTransactions")
        .update({
          payOutStatus: "requested",
          payOutRequestDate: new Date().toISOString(),
          payOutRequestedBy: userId,
          payoutReference: payOutRef,
        })
        .in("id", payload.transactionId);

      if (error) throw error;

      const { error: secondError } = await supabase.from("payOut").insert({
        payOutStatus: "requested",
        requestedBy: userId,
        payOutRef,
        Amount: payload.amount,
        requestedFor: payload.requestedFor,
      });

      if (secondError) throw error;

      return NextResponse.json(
        { msg: "payout requested successfully" },
        {
          status: 201,
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
