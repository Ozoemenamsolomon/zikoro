import { InviteTemplate } from "@/components/emailTemplates";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const { InviteDetails, message } = params;

      console.log(InviteDetails.map(({ email }: { email: string }) => email));
      const data = await resend.emails.send({
        from: "Zikoro <zikoro.com>",
        to: InviteDetails.map(({ email }: { email: string }) => email),
        subject: "Hello world",
        react: InviteTemplate({ message }),
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
