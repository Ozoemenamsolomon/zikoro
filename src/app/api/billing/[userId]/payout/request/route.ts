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

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const date = new Date();

      const resp = await client.sendMail({
        from: {
          address: process.env.NEXT_PUBLIC_EMAIL,
          name: "Zikoro",
        },
        to: [
          {
            email_address: {
              address: payload.userEmail,
              name: payload.userName,
            },
          },
        ],
        subject: `Payout requested: ${payOutRef}`,
        htmlbody: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 20px 0px;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 10px 0;">
            <img src=${"/zikoro.png"} alt="Company Logo" style="max-width: 150px;">
        </div>
        <div style="margin: 20px 0;">
            <h1 style="margin-bottom: 20px;">Payout Requested</h1>
            <p>Dear ${payload.userName},</p>
            <p>Here's information on your requested payout: <span style="color: #001FCC; font-weight: bold;">NGN${
              payload.amount
            }</span>.</p>
            <p>Transaction Details:</p>
            <ul style="line-height: 1.6; margin: 20px 0; padding-left: 20px;">
                <li><strong>Payout Amount:</strong> NGN${payload.amount}</li>
                <li><strong>Transaction ID:</strong> ${payOutRef}</li>
                <li><strong>Request Date:</strong> ${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}</li>
            </ul>
            <p>If you have any questions or concerns, please feel free to <a href="mailto:support@example.com" style="color: #001FCC; text-decoration: none;">contact our support team</a>.</p>
            <p>Thank you for using our services.</p>
            <p>Sincerely,<br>The Zikoro Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd; color: #777777;">
            <p>&copy; 2024 Zikoro. All rights reserved.</p>
        </div>
    </div>
</body>
`,
      });

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
