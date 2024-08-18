import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { SendMailClient } from "zeptomail";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const params = await req.json();
  const { email, eventAlias: eventAlias } = params;
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get("trackingId");

  try {
    const { data: invitee, error: fetchError } = await supabase
      .from("attendeeEmailInvites")
      .select("*, events(*, organization!inner(*))")
      .eq("email", email)
      .eq("eventAlias", eventAlias)
      .single();

    if (fetchError) throw fetchError;

    const {
      name,
      events: {
        startDateTime,
        endDateTime,
        eventPoster,
        description,
        eventAddress,
        eventTitle,
        organization: { organizationName, eventContactEmail },
      },
    } = invitee;

    const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
    const senderName = "Zikoro";
    const subject = `Resend: Invite from ${organizationName} to ${eventTitle}`;
    const htmlbody = (trackingId: string) => `<div
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
        trackingId
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
      href="https://${
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

    const client = new SendMailClient({
      url: process.env.NEXT_PUBLIC_ZEPTO_URL,
      token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
    });

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
              name,
            },
          },
        ],
        subject,
        htmlbody: htmlbody(trackingId, email),
      });
      console.log(`Email sent to ${email}:`, resp);

      const { error: updateError } = await supabase
        .from("attendeeEmailInvites")
        .update({
          lastResendAt: new Date().toISOString(),
        })
        .eq("email", email)
        .eq("eventAlias", eventAlias);

      if (updateError) throw updateError;

      return NextResponse.json(
        { msg: `Resend email sent successfully to ${email}` },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      return NextResponse.json(
        { error: `Failed to send email to ${email}` },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the request.",
      },
      {
        status: 500,
      }
    );
  }
}
