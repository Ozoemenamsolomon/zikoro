import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deploymentUrl } from "@/utils";
export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { data, error: checkIfRegisteredError } = await supabase
        .from("events")
        .select("*")
        .eq("email", params.email)
        .eq("eventId", params.eventId)
        .maybeSingle();

      if (checkIfRegisteredError) throw checkIfRegisteredError?.code;
      if (data) throw "email error";

      const { error } = await supabase.from("attendees").insert(params);
      if (error) throw error.code;

      return NextResponse.json(
        { msg: "attendee created successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error:
            error === "email error"
              ? "Email already registered for this event"
              : "An error occurred while making the request.",
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

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (req.method === "PATCH") {
    try {
      const params = await req.json();
      let nodemailer = require("nodemailer");
      const { error } = await supabase
        .from("events")
        .upsert(params, { onConflict: "eventAlias" });

      if (error) {
        return NextResponse.json(
          {
            error: error?.message,
          },
          {
            status: 400,
          }
        );
      }

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
        from: `Zikoro <${process.env.NEXT_PUBLIC_EMAIL}>`,
        to: email,
        subject: `Your ${params?.eventTitle} is Live!`,
        html: `<div>
     

     <p> Hi [Event Creator's Name],</p>
      
     <p> Great news! Your event is officially live, and attendees can now register using the following link: [Insert Registration Link]</p>
      
      <p>You can track attendee registration and other details in the Zikoro app ${deploymentUrl}/event/${params?.eventAlias}/people/all as they register, ensuring you stay up-to-date with all participant information.</p>
      
      <p>Let us know if you have any questions or need further assistance.</p>
      
      Best,
      Tola From Zikoro
      Phone/Whatsapp: +2347041497076 
          
          </div>`,
      };

      await transporter.sendMail(mailData, function (err: any, info: any) {
        if (err) throw err;
        else console.log(info);
      });

      if (error) throw error;

      return NextResponse.json(
        { msg: "event updated successfully" },
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

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: number } }
) {
  const { eventId } = params;
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const isAlias = searchParams.get("isAlias");

      console.log(isAlias, eventId);

      const { data, error, status } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq(isAlias === "1" ? "eventAlias" : "id", eventId)
        .maybeSingle();

      if (error) throw error;

      return NextResponse.json(
        {
          data,
        },
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
