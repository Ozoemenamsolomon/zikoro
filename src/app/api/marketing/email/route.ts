import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const query = supabase.from("sentEmails").select("*");

      if (userId) query.eq("userId", userId);

      const { data, error, status } = await query;

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

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const {
        emailCategory,
        subject,
        sendersName,
        emailBody,
        emailRecipient,
        replyTo,
        eventAlias,
      } = params;

      // let nodemailer = require("nodemailer");
      // const transporter = nodemailer.createTransport({
      //   host: "smtp.zoho.com",
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: process.env.NEXT_PUBLIC_EMAIL,
      //     pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      //   },
      // });

      const { data: currentEvent, error: eventError } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("eventAlias", eventAlias)
        .maybeSingle();

      if (eventError) throw eventError;

      const emailIdentifier = generateAlphanumericHash(8);

      const body = emailBody.replaceAll(/#{(.*?)#}/g, (match, value) => {
        switch (value.trim()) {
          case "eventName":
            return currentEvent.eventTitle;
          case "eventAddress":
            return currentEvent.eventAddress;
        }
      });

      var { SendMailClient } = require("zeptomail");
      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      emailRecipient.forEach(async (email: string) => {
        try {
          const resp = await client.sendMail({
            from: {
              address: process.env.NEXT_PUBLIC_EMAIL,
              name: sendersName,
            },
            to: [
              {
                email_address: {
                  address: email,
                  name: "affiliate",
                },
                client_reference: emailIdentifier,
                track_opens: true,
                track_clicks: true,
              },
            ],
            subject,
            htmlbody: `<div>${body}</div>`,
          });

          // const mailData = {
          //   from: `${sendersName} <${process.env.NEXT_PUBLIC_EMAIL}>`,
          //   to: email,
          //   subject: `${emailCategory} email`,
          //   html: `<div>${emailBody}</div>`,
          //   replyTo,
          // };

          // await transporter.sendMail(mailData, function (err: any, info: any) {
          //
          //   if (err) throw err;
          //   else
          // });
        } catch (error) {
          console.error(`Error sending email to ${email}:`, error);
        }
      });

      const { error } = await supabase
        .from("sentEmails")
        .insert({ ...params, emailIdentifier });
      if (error) throw error;

      return NextResponse.json(
        { msg: "email sent successfully" },
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

export const dynamic = "force-dynamic";
