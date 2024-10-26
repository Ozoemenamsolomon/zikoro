import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { format, getYear, getMonth, getDay } from "date-fns";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    if (req.method !== "POST") throw new Error("Invalid HTTP method");

    const params = await req.json();

    // Validate required fields
    if (!params.email || !params.eventId) {
      throw new Error("Missing required fields: email and eventId");
    }

    // Check for duplicate registration if no attendee ID is provided
    if (!params.id) {
      const { data, error: checkError } = await supabase
        .from("attendees")
        .select("*")
        .eq("email", params.email)
        .eq("eventAlias", params.eventId)
        .maybeSingle();

      if (checkError) throw new Error(`Supabase error: ${checkError.message}`);
      if (data) throw new Error("Email already registered for this event");
    }

    // Insert or update the attendee
    const { data: attendee, error: attendeeError } = await supabase
      .from("attendees")
      .upsert({ ...params, eventAlias: params.eventId })
      .select();

    if (attendeeError)
      throw new Error(`Supabase error: ${attendeeError.message}`);

    // Update the registered count in the event table if a new attendee is added
    if (!params.id) {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("registered")
        .eq("eventAlias", params.eventId)
        .maybeSingle();

      if (eventError) throw new Error(`Supabase error: ${eventError.message}`);
      if (!event) throw new Error("Event not found");

      const { data: updatedEvent, error: updateError } = await supabase
        .from("events")
        .update({ registered: event.registered + 1 })
        .eq("eventAlias", params.eventId)
        .select("*, organization!inner(*)")
        .maybeSingle();

      if (updateError)
        throw new Error(`Supabase error: ${updateError.message}`);
      if (!updatedEvent)
        throw new Error("Failed to update event registration count");

      const {
        startDateTime,
        email,
        eventAddress,
        organisationName,
        eventTitle,
        endDateTime,
        eventPoster,
      } = updatedEvent as any; // adjust according to actual types

      console.log(updatedEvent);

      // Prepare email and calendar details
      var { SendMailClient } = require("zeptomail");

      const client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const formattedDate = format(
        new Date(params.registrationDate),
        "MM/dd/yyyy"
      );

      const icsEvent = {
        start: [
          getYear(startDateTime),
          getMonth(startDateTime),
          getDay(startDateTime),
        ],
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
          email: updatedEvent.organization.eventContactEmail,
        },
      };

      const emailContent = generateEmailContent(
        params,
        updatedEvent,
        formattedDate
      );
      await client.sendMail({
        from: { address: process.env.NEXT_PUBLIC_EMAIL, name: "Zikoro" },
        to: [
          { email_address: { address: params.email, name: params.firstName } },
        ],
        subject: `Confirmation to attend ${eventTitle}`,
        htmlbody: emailContent,
      });
    }

    return NextResponse.json(
      { msg: "attendee registered successfully" },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in registration handler:", error.message || error);
    return NextResponse.json(
      { msg: error.message || "Registration failed" },
      {
        status: 500,
      }
    );
  }
}

// Generate email content based on attendee and event details
function generateEmailContent(params, event, formattedDate) {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding-bottom: 1rem;">
        <p style="font-weight: 600; text-transform: uppercase; font-size: 20px">${
          event.eventTitle
        }</p>
        <img src="${
          event.eventPoster
        }" alt="event-image" style="width: 100%; height: 250px; object-fit: cover;">
        <p>Order Date: ${formattedDate}</p>
        <p>Venue: ${event.eventAddress}</p>
        <p>Date & Time: ${format(event.startDateTime, "PPP")} - ${format(
    event.endDateTime,
    "PPP"
  )}</p>
      <a href="https://www.zikoro.com/event/${
        event.eventAlias
      }/reception?email=${params.email}"    style="
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
      ">Join Event</a>
      </div>
    `;
}

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const { error } = await supabase
        .from("attendees")
        .upsert(params, { onConflict: "id" });

      if (error) {
        return NextResponse.json({ error: error?.message }, { status: 400 });
      }
      if (error) throw error;
      return NextResponse.json(
        { msg: "attendees updated successfully" },
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    try {
      const query = supabase
        .from("attendees")
        .select("*")
        .order("registrationDate", { ascending: false });

      if (email) query.eq("email", email);
      if (eventId) query.eq("eventAlias", eventId);
      if (userId) query.eq("userId", userId);

      const { data, error, status } = await query;

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
