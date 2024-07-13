import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToICSFormat } from "../../payment/route";
import { Event, TOrganization } from "@/types";
import { format } from "date-fns";

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
      const { InviteDetails, Message, eventName, eventId } = params;

      console.log(eventId);

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const { data: currentEvent, error: eventError } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("eventAlias", eventId)
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
      } = currentEvent as never as Event & { organization: TOrganization };

      const ics = require("ics");

      const date = new Date();
      // format Date

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      const formattedDate: string = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(date);

      // convert date to ics format
      const icsDateFormat = convertToICSFormat(startDateTime);

      // Create iCalendar event
      const icsEvent = {
        ...icsDateFormat,
        title: eventTitle,
        location: eventAddress,
        attendees: [
          {
            name: `${params.firstName} ${params.lastName}`,
            email: params.email,
          },
        ],
        organizer: {
          name: organisationName,
          email: currentEvent.organization.eventContactEmail,
        },
        // Add other event details as needed
        //  organizerContact?.email
      };

      // Generate iCalendar content
      const { error: icsError, value: iCalendarContent }: any =
        await new Promise((resolve) => {
          ics.createEvent(icsEvent, (error: Error, value: string) => {
            resolve({ error, value });
          });
        });

      if (icsError) {
        throw icsError;
      }

      const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
      const senderName = "Zikoro";
      const subject = `Invite from to ${eventName}`;
      const htmlbody = `<div>${Message}</div>`;

      for (const { email } of InviteDetails) {
        try {
          const resp = await client.sendMail({
            from: {
              address: senderAddress,
              name: senderName,
            },
            to: [
              {
                email_address: {
                  address: email,
                  name: "attendee",
                },
              },
            ],
            subject,
            htmlbody,
            attachments: [
              {
                name: "event.ics",
                content: iCalendarContent,
                mime_type: "text/calendar",
              },
            ],
          });
          console.log(`Email sent to ${email}:`, resp);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
        }
      }

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
