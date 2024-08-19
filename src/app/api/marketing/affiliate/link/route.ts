import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { convertDateFormat } from "@/utils/date";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { affiliateName, organizationName, eventPoster, payload } = params;

      const {
        affiliateEmail,
        eventName,
        Goal,
        validity,
        commissionType,
        commissionValue,
        eventId,
      } = payload;

      const linkCode = generateAlphanumericHash(7);
      const affiliateLink = `${window.location.host}/live-events${eventId}?affiliateCode=${linkCode}`;

      let nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
      });

      const mailData = {
        from: `${organizationName} <${process.env.NEXT_PUBLIC_EMAIL}>`,
        to: affiliateEmail,
        subject: "Your afiliate link is ready",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Affiliate Link Email</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header img {
              max-width: 100%;
              height: auto;
            }
            .content {
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${eventPoster}" alt="Event Poster">
            </div>
            <div class="content">
              <p>Hi ${affiliateName},</p>
              <p>This is your affiliate link to promote <b>${eventName}</b>. It is valid until: <b>${convertDateFormat(
          validity
        )}</b>. You get <b>${
          commissionType === "fixed" ? "NGN" : ""
        }${commissionValue} ${
          commissionType === "percentage" ? "%" : ""
        }</b> commission when your referrals complete the following event goal: <b>${Goal}</b>.</p>
              <p>Here's your link <a href="${affiliateLink}" class="">${affiliateLink}</a></p>
              <p><i>Best regards</i></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${eventName} Team. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      };

      await transporter.sendMail(
        mailData,
        async function (err: any, info: any) {
          if (err) {
            throw err;
          }

          const { error } = await supabase
            .from("affiliateLinks")
            .insert({ ...payload, linkCode, affiliateLink });

          if (error) throw error;
        }
      );

      return NextResponse.json(
        { msg: "certificate saved successfully" },
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
          status: 400,
        }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Method not allowed" },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");

      const { data, error, status } = await supabase
        .from("affiliateLinks")
        .select("*, affiliate!inner(*), eventTransactions!inner(*)")
        .eq("userId", userId);

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
