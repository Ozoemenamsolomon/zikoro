import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from "zeptomail"; // Import the mail client

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get("trackingId");

  if (!trackingId) {
    return NextResponse.json(
      { error: "Tracking ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch invite details
    const { data: inviteDetails, error: fetchError } = await supabase
      .from("attendeeEmailInvites")
      .select("*")
      .eq("trackingId", trackingId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }
    if (!inviteDetails) {
      return NextResponse.json(
        { error: "Tracking ID is not valid." },
        { status: 400 }
      );
    }

    const { eventAlias, email } = inviteDetails;
    console.log(eventAlias);

    // Fetch event details
    const { data: eventDetails, error: eventError } = await supabase
      .from("events")
      .select("*, organization!inner(*)")
      .eq("eventAlias", eventAlias)
      .maybeSingle();

    console.log(eventDetails, eventError);

    if (eventError) {
      console.log(eventError);
      throw eventError;
    }
    if (!eventDetails) {
      console.log(eventDetails);
      throw new Error("Event not found.");
    }

    const {
      organization: { eventContactEmail, organizationName },
      eventTitle,
    } = eventDetails;

    const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
    const senderName = "Zikoro";
    const subject = `Rejection Notice for ${eventTitle}`;
    const htmlbody = `<p>The invitee with email ${email} has declined the invitation to ${eventTitle}.</p>`;

    // Send email to the event organizer
    const client = new SendMailClient({
      url: process.env.NEXT_PUBLIC_ZEPTO_URL,
      token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
    });

    await client.sendMail({
      from: {
        address: senderAddress,
        name: senderName,
      },
      to: [
        {
          email_address: {
            address: eventContactEmail,
            name: organizationName,
          },
        },
      ],
      subject,
      htmlbody,
    });

    // Update invite status in the database
    await supabase
      .from("attendeeEmailInvites")
      .update({
        response: "not attending",
        responseDate: new Date().toISOString(),
      })
      .eq("trackingId", trackingId);

    // Redirect to the response page
    return NextResponse.redirect(
      "https://" + process.env.NEXT_PUBLIC_HOME_URL + "/invite/response"
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the rejection." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
