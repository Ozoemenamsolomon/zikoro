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
              name: "User",
            },
          },
        ],
        subject: `Your ${params?.eventTitle} is Live!`,
        htmlbody: `<div>
     

        <p> Hi [Event Creator's Name],</p>
         
        <p> Great news! Your event is officially live, and attendees can now register using the following link: ${deploymentUrl}/live-events/${params?.eventAlias} </p>
         
         <p>You can track attendee registration and other details in the Zikoro app ${deploymentUrl}/event/${params?.eventAlias}/people/all as they register, ensuring you stay up-to-date with all participant information.</p>
         
         <p>Let us know if you have any questions or need further assistance.</p>
         
         <p>Best,</p>
        <p> Tola From Zikoro</p>
         <p>Phone/Whatsapp: +2347041497076 </p>
             
             </div>`,
      });

      //  console.log(resp)

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
