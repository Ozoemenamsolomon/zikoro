import { InviteTemplate } from "@/components/emailTemplates";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("attendeeEmailInvites")
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
      const { InviteDetails, Message } = params;

      console.log(InviteDetails.map(({ email }: { email: string }) => email));
      let nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
      });

      const mailData = {
        from: process.env.NEXT_PUBLIC_EMAIL,
        to: InviteDetails.map(({ email }: { email: string }) => email),
        subject: `Invite from [organization] to [event name]`,
        html: `<div>${Message}</div>`,
      };

      await transporter.sendMail(mailData, function (err, info) {
        if (err) throw err;
        else console.log(info);
      });

      const { error } = await supabase
        .from("attendeeEmailInvites")
        .insert(params);
      if (error) throw error;
      return NextResponse.json(
        { msg: "invites sent successfully" },
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
