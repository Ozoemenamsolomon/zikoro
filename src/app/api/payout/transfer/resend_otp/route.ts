import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Ensure the method is POST
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();

    // Validate the request body
    if (!body.transferCode) {
      return NextResponse.json(
        { error: "Transfer code is required" },
        { status: 400 }
      );
    }

    const resendOTPParams = {
      transfer_code: body.transferCode,
      reason: "transfer",
    };

    const config = {
      headers: {
        Authorization: `Bearer sk_test_08e2c07402912fd01816ead89a786bff070e2d85`,
        "Content-Type": "application/json",
      },
    };

    const resendOTPResponse = await axios.post(
      `https://api.paystack.co/transfer/resend_otp`,
      resendOTPParams,
      config
    );

    // Check for successful response
    if (!resendOTPResponse.data.status) {
      return NextResponse.json(
        { error: resendOTPResponse.data.message },
        { status: 400 }
      );
    }

    console.log(resendOTPResponse.data.data);

    return NextResponse.json(
      { msg: resendOTPResponse.data.message },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error resending OTP:",
      axios.isAxiosError(error) ? error?.response : error
    );

    // Handle specific error cases if possible
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status other than 2xx
        return NextResponse.json(
          { error: error.response.data.message || "Request failed" },
          { status: error.response.status || 500 }
        );
      } else if (error.request) {
        // No response received from server
        return NextResponse.json(
          { error: "No response received from server" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "An error occurred while making the request." },
      { status: 500 }
    );
  }
}
