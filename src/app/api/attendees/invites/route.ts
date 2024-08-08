import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToICSFormat } from "../../payment/route";
import { Event, TOrganization } from "@/types";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    const {
      data: emailInvites,
      error,
      status,
    } = await supabase
      .from("attendeeEmailInvites")
      .select("*")
      .eq("eventAlias", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status });
    }

    const emailInvitesWithGuests = await Promise.all(
      emailInvites.map(async ({ guests, ...rest }) => {
        if (guests && guests.length > 0) {
          const { data: guestsData, error: guestsError } = await supabase
            .from("attendees")
            .select("*")
            .in("attendeeAlias", guests);

          if (guestsError) {
            console.error(guestsError);
            throw new Error("Error fetching guest data");
          }

          return { ...rest, guests: guestsData };
        } else {
          return { ...rest, guests: [] };
        }
      })
    );

    return NextResponse.json({ data: emailInvitesWithGuests }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while making the request." },
      { status: 500 }
    );
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

      if (eventError) throw eventError;

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
      const htmlbody = (trackingId: string, role: string) => `<div
  style="
    max-width: 600px;
    margin: 0 auto;
    display: block;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #b4b4b4;
  "
>
  <h1 style="font-weight: 600; text-transform: uppercase; font-size: 20px">
    Invitation to attend ${eventTitle}
  </h1>
  <div style="width: 100%; height: 250px">
    <img
      src="${eventPoster}"
      alt="event-image"
      style="
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 8px;
      "
    />
  </div>
  <p style="font-size: 14px; margin-bottom: 10px">
    You have officially been invited to ${eventTitle} by ${organizationName}
  </p>
  <p style="font-size: 14px; margin-bottom: 10px">
    To respond to this email, choose one of the following options
  </p>
  <div style="display: flex; gap: 10px">
    <a
      href="http://${
        process.env.NEXT_PUBLIC_HOME_URL +
        "/live-events/" +
        eventAlias +
        "?trackingId=" +
        trackingId +
        "&role=" +
        role
      }"
      style="
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        margin-right: 10px;
        padding: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        text-align: center;
        text-decoration: none;
        background-color: rgb(0, 31, 204);
        border-radius: 6px;
        border: 0;
      "
    >
      <p style="margin: 0; width: 100%; text-align: center; color: white">
        Register for Event
      </p>
    </a>
    <a
      href="http://${
        process.env.NEXT_PUBLIC_HOME_URL +
        "/api/attendees/invites/reject?trackingId=" +
        trackingId
      }"
      style="
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        text-align: center;
        text-decoration: none;
        background-color: red;
        border-radius: 6px;
        border: 0;
      "
    >
      <p style="margin: 0; width: 100%; text-align: center; color: white">
        Not Attending
      </p>
    </a>
  </div>
</div>
<div
  style="
    max-width: 600px;
    margin: 0 auto;
    font-size: 14px;
    color: #b4b4b4;
  "
>
  This event is managed by ${organizationName} and powered by
  <a href="http://www.zikoro.com" style="color: #001fcc">Zikoro</a>. For assistance, visit our
  <a href="http://www.zikoro.com/help" style="color: #001fcc">help center</a>.
</div>
<div
  style="
    max-width: 600px;
    margin: 0.3rem auto;
    font-size: 14px;
    text-align: center;
  "
>
  <a href="#" style="color: #001fcc; text-decoration: none">Privacy Policy </a> |
  <a href="#" style="text-decoration: none; color: #001fcc">Terms and Conditions</a>
</div>
`;

      for (const { name, email, role, trackingId } of invitees) {
        // console.log(htmlbody(trackingId));

        const { data: existingInvitees, error } = await supabase
          .from("attendeeEmailInvites")
          .select("email")
          .eq("email", email)
          .eq("eventAlias", eventAlias);

        if (error) {
          console.error(`Error checking invitees: ${error}`);
          continue;
        }

        if (existingInvitees && existingInvitees.length > 0) {
          console.log(`Email already sent to ${email}`);
          continue;
        }

        try {
          // const calendarICS = createICSContent(
          //   startDateTime,
          //   endDateTime,
          //   description,
          //   eventAddress,
          //   { name: organizationName, email: eventContactEmail },
          //   { name, email }
          // );
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
            htmlbody: htmlbody(trackingId, role),
            // attachments: [
            //   {
            //     name: "event.ics",
            //     content: Buffer.from(calendarICS).toString("base64"),
            //     mime_type: "text/calendar",
            //   },
            // ],
          });
          console.log(`Email sent to ${email}:`, resp);

          const { error: insertError } = await supabase
            .from("attendeeEmailInvites")
            .insert({
              trackingId,
              name,
              email,
              role,
              Message: message,
              method: "email",
              response: "pending",
              eventAlias,
            });

          if (insertError) continue;
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
        }
      }

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
