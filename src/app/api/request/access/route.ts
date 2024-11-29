
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 
  if (req.method === "POST") {
    try {
      const params = await req.json();
      const { email, paymentLink, eventTitle } = params;

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const resp = await client.sendMail({
        from: {
          address: process.env.NEXT_PUBLIC_EMAIL,
          name: "Zikoro",
        },
        to: [
          {
            email_address: {
              address: email,
              name: "Attendee",
            },
          },
        ],
        subject: `Join ${eventTitle}`,
        htmlbody: `<div>
        <a href="${paymentLink}">${paymentLink}</a>
 </div>`,
      });

      return NextResponse.json(
        { msg: "" },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error, "patch");
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
