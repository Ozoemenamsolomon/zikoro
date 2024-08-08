import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const accountNumber = searchParams.get("accountNumber");
      const bankCode = searchParams.get("bankCode");

      console.log(
        bankCode,
        accountNumber,
        process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY
      );

      const response = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer sk_test_08e2c07402912fd01816ead89a786bff070e2d85`,
          },
        }
      );

      console.log(response.data);

      return NextResponse.json(
        { data: response.data.data },
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
