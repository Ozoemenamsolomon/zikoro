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

      console.log(response.data.data, "paystack response");

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

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const date = new Date();

      const resp1 = await client.sendMail({
        from: {
          address: process.env.NEXT_PUBLIC_EMAIL,
          name: "Zikoro",
        },
        to: [
          {
            email_address: {
              address: body.userEmail,
              name: body.userName,
            },
          },
        ],
        subject: `Payout completed: ${reference}`,
        htmlbody: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 20px 0px;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 10px 0;">
              <img src="https://res.cloudinary.com/zikoro/image/upload/v1728730327/ZIKORO/zikoro1_ckfkln.jpg" alt="Company Logo" style="max-width: 150px;">
          </div>
          <div style="margin: 20px 0;">
              <h1 style="margin-bottom: 20px;">Payout completed</h1>
              <p>Dear ${body.userName},</p>
              <p>Your requested payout of <span style="color: #001FCC; font-weight: bold;">NGN${
                body.amount
              }</span> was completed.</p>
              <p>Transaction Details:</p>
              <ul style="line-height: 1.6; margin: 20px 0; padding-left: 20px;">
                  <li><strong>Payout Amount:</strong> NGN${body.amount}</li>
                  <li><strong>Transaction ID:</strong> ${reference}</li>
                  <li><strong>Pay Out Date:</strong> ${
                    date.getMonth() + 1
                  }/${date.getDate()}/${date.getFullYear()}</li>
              </ul>
              <p>If you have any questions or concerns, please feel free to <a href="mailto:support@zikoro.com" style="color: #001FCC; text-decoration: none;">contact our support team</a>.</p>
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

      const resp2 = await client.sendMail({
        from: {
          address: process.env.NEXT_PUBLIC_EMAIL,
          name: "Zikoro",
        },
        to: [
          {
            email_address: {
              address: body.paidOutEmail,
              name: body.paidOutName,
            },
          },
        ],
        subject: `Payout successful: ${reference}`,
        htmlbody: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 20px 0px;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 10px 0;">
              <img src=${"/zikoro.png"} alt="Company Logo" style="max-width: 150px;">
          </div>
          <div style="margin: 20px 0;">
              <h1 style="margin-bottom: 20px;">Payout successful</h1>
              <p>Dear ${body.paidOutName},</p>
              <p>Your payout of <span style="color: #001FCC; font-weight: bold;">NGN${
                body.amount
              }</span> was processed successful.</p>
              <p>Transaction Details:</p>
              <ul style="line-height: 1.6; margin: 20px 0; padding-left: 20px;">
                  <li><strong>Payout Amount:</strong> NGN${body.amount}</li>
                  <li><strong>Transaction ID:</strong> ${reference}</li>
                  <li><strong>Pay Out Date:</strong> ${
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
