import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToICSFormat } from "../../payment/route";
import { Event, TOrganization } from "@/types";
import { format } from "date-fns";
import { createICSContent } from "@/utils";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const eventId = searchParams.get("eventId");

      const { data, error, status } = await supabase
        .from("attendeeEmailInvites")
        .select("*")
        .eq("eventId", eventId);

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
      const { invitees, message, eventAlias } = params;

      console.log(eventAlias);

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const { data: currentEvent, error: eventError } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("eventAlias", eventAlias)
        .maybeSingle();

      if (eventError) throw eventError.code;

      const {
        startDateTime,
        email,
        eventAddress,
        organisationName,
        eventTitle,
        endDateTime,
        eventPoster,
        description,
        organization: { organizationName, eventContactEmail },
      } = currentEvent as never as Event & { organization: TOrganization };

      const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
      const senderName = "Zikoro";
      const subject = `Invite from ${organizationName} to ${eventTitle}`;
      const htmlbody = `<div 
      style="
        max-width: 600px;
        margin: 0 auto;
        display: block;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #b4b4b4;
      ">
        <h1 style="font-weight: 600; text-transform: uppercase; font-size: 20px">
          Invitation to attend ${eventTitle}
        </p>
        <div style="width: 100%; height: 250px">
          <img
            src=${eventPoster}
            alt="event-image"
            style="
              width: 100%;
              height: 100%;
              border-radius: 8px;
              object-fit: cover;
              margin-bottom: 8px;
            "
          >
        </div>
        <p style="font-size: 14px; margin-bottom:10px;">
          You have officially been invited to ${eventTitle} by ${organizationName}
        </p>
        <p style="font-size: 14px; margin-bottom:10px;">
          To respond to this email, choose one of the following options
        </p>
        <div style="display:flex; gap:10px">
        <button
          style="
          width:100%;
          max-width: 600px;
          margin:0 auto;
        padding:0.8rem;
        display:flex;
        align-items:center;
        justify-content:center;
          font-size: 14px;
          color: white;
          text-align: center;
          text-decoration: none;
          background-color: rgb(0, 31, 204);
          border-radius: 6px;
          border: 0;
          "
        >
          <p style="margin:0; width:100%; text-align:center; color:white">Register for Event</p>
        </button>
        <button
          style="
          width:100%;
          max-width: 600px;
          margin:0 auto;
        padding:0.8rem;
        display:flex;
        align-items:center;
        justify-content:center;
          font-size: 14px;
          color: white;
          text-align: center;
          text-decoration: none;
          background-color: red;
          border-radius: 6px;
          border: 0;
          "
        >
          <p style="margin:0; width:100%; text-align:center; color:white">Not Attending</p>
        </button>
        </div>
      </div>
  <div style="max-width:600px; margin:0 auto; font-size: 14px; color: #b4b4b4">
            This event is managed by ${organizationName} and powered by
            <a href="www.zikoro.com" style="color: #001fcc">Zikoro</a>. For assistance, visit our
            <a href="www.zikoro.com/help" style="color: #001fcc">help center</a>.
          </div>
          <div
          style="max-width:600px; margin:0.3rem auto; font-size: 14px; text-align:center;"
          ><a href="#" style="color: #001fcc; text-decoration: none;">Privacy Policy </a> | <a href="#" style="text-decoration: none; color: #001fcc">Terms and Conditions</a></div>
        </div>`;

      for (const { name, email } of invitees) {
        try {
          const calendarICS = createICSContent(
            startDateTime,
            endDateTime,
            description,
            eventAddress,
            { name: organizationName, email: eventContactEmail },
            { name, email }
          );
          const resp = await client.sendMail({
            from: {
              address: senderAddress,
              name: senderName,
            },
            to: [
              {
                email_address: {
                  address: email,
                  name,
                },
              },
            ],
            subject,
            htmlbody,
            attachments: [
              {
                name: "event.ics",
                content: Buffer.from(calendarICS).toString("base64"),
                mime_type: "text/calendar",
              },
            ],
          });
          console.log(`Email sent to ${email}:`, resp);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
        }
      }

      const { error } = await supabase.from("attendeeEmailInvites").insert(
        invitees.map((invitee) => ({
          ...invitee,
          Message: message,
          method: "email",
          response: "pending",
          eventAlias,
        }))
      );

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
