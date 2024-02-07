import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("sentEmails")
        .select("*");

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

      const { emailCategory, subject, sendersName, emailBody, emailRecipient } =
        params;

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
        from: `${sendersName} <${process.env.NEXT_PUBLIC_EMAIL}>`,
        to: emailRecipient,
        subject: `${emailCategory} email`,
        html: `<div>${emailBody}</div>`,
      };

      await transporter.sendMail(mailData, function (err, info) {
        if (err) throw err;
        else console.log(info);
      });

      const { error } = await supabase.from("sentEmails").insert(params);
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
