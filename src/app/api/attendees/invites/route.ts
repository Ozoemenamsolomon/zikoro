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
        to: 
        InviteDetails.map(({ email }: { email: string }) => (  {
          email_address: {
            address: email,
            name: "attendee",
          },
        
        })),
        subject: `Invite from [organization] to [event name]`,
        htmlbody: `<div>${Message}</div>`,
      });
      
      
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

      // const mailData = {
      //   from: `Zikoro <${process.env.NEXT_PUBLIC_EMAIL}>`,
      //   to: ,
      //   subject: ,
      //   html: ,
      // };

      // await transporter.sendMail(mailData, function (err: any, info: any) {
      //   if (err) throw err;
      //   else 
      // });

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
