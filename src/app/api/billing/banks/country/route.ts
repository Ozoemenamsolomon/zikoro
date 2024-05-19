import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const response = await axios.get(`https://api.paystack.co/country`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY}`,
        },
      });

    //   console.log(response);

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
