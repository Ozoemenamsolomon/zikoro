import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const supabase = createRouteHandlerClient({ cookies });

      const body = await req.json();

      const params = {
        transfer_code: body.transferCode,
        otp: body.OTP,
      };

      const config = {
        headers: {
          Authorization: `Bearer sk_test_08e2c07402912fd01816ead89a786bff070e2d85`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `https://api.paystack.co/transfer/finalize_transfer`,
        params,
        config
      );

      if (!response.data.status) throw new Error(response.data.message);

      console.log(response.data.data);

      const { reference } = response.data.data;

      const { error: eventTransactionError } = await supabase
        .from("eventTransactions")
        .update({
          payoutReference: reference,
          payOutStatus: "paid",
          payOutDate: new Date(),
        })
        .eq("payoutReference", body.payOutRef);

      if (eventTransactionError) throw new Error(eventTransactionError.message);

      const { error: payoutError } = await supabase
        .from("payOut")
        .update({
          payOutRef: reference,
          payOutStatus: "paid",
          paidAt: new Date(),
          paidOutBy: body.paidOutBy,
        })
        .eq("payOutRef", body.payOutRef);

      if (payoutError) throw new Error(payoutError.message);

      return NextResponse.json(
        {
          msg: "payout transferred successfully",
          data: { reference },
        },
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
