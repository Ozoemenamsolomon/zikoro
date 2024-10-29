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

    const { data: oldUser, error: oldUserError } = await supabase
      .from("users")
      .select("*")
      .eq("userEmail", params.email)
      .maybeSingle();

    if (oldUserError) throw oldUserError;

    console.log(params, "params");

    if (!oldUser) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          firstName: params.firstName || null,
          lastName: params.lastName || null,
          phoneNumber: params.phoneNumber || null,
          jobTitle: params.jobTitle || null,
          organization: params?.organization || null,
          city: params.city || null,
          country: params.country || null,
          linkedin: params.linkedin || null,
          instagram: params.instagram || null,
          facebook: params.facebook || null,
          bio: params.bio || null,
          userEmail: params.email || "ubahyusuf484@gmail.com",
          x: params.x || null,
          created_at: new Date().toISOString(),
        })
        .select("*");

      console.log(user, "users", userError, "error");

      if (userError) throw userError;
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
function generateEmailContent(attendee, event, formattedDate) {
  return `
<div style=" background: " #000000">
  <div style="
                max-width: 600px;
                margin: 0 auto;
                display: block;
                padding-bottom: 1rem;
                margin-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
              ">
    <p style="font-weight: 600; text-transform: uppercase; font-size: 20px">
      ${event.eventTitle}
    </p>
    <div style="width: 100%; height: 250px">
      <img src="${event.eventPoster}" alt="event-image" style="
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                  ">
    </div>
    <div style="
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  align-items: center;
                  justify-content: space-between;
                ">
      <p style="font-size: 13px; color: #b4b4b4; width: 50%;">Order Date: ${format(
        new Date(),
        "PPP"
      )}</p>
      <p style="font-size: 13px; color: #b4b4b4 width:50%; text-align: end;">Reference <span
          style="color:black; margin-left:3px; font-weight: 500;">In-house</span></p>
    </div>
  </div>
  <div style="max-width: 600px; margin:0 auto; display: flex;">
    <div style="float:left;">
      <!--registeredAttendees[0]-->
      <div style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              padding: 1rem 0rem;
              gap: 0.75rem;
              margin: 0;
            ">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-user-50.png?alt=media&token=9a491723-d02b-4610-8399-00781c7cb206"
          style="width: 30px; height: 30px;">
        <div style="
                display: block;
               
                gap: 0.4rem;
              ">
          <p style="font-size: 14px; font-weight: 600; margin: 0; margin-bottom:2px;">
            Registered Attendee
          </p>
          <p style="color: #b4b4b4; font-size: 14px; margin: 0;">${
            attendee.firstName + " " + attendee.lastName
          }</p>

          <a href="https://www.zikoro.com/event/${
            event.eventAlias
          }/people/info/${attendee.attendeeAlias}?email=${
    attendee?.email
  }&createdAt=${new Date().toISOString()}&isPasswordless=${true}&alias=${
    attendee?.attendeeAlias
  }" style="display: block; color: #001fcc; font-size: 12px; text-decoration: none;">
            Update Profile</a>

        </div>
      </div>
      <!---registration-->
      <div style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              padding: 1rem 0rem;
              gap: 0.75rem;
            ">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-ticket-50.png?alt=media&token=8c9d3ec1-d450-4d28-8258-692693856667"
          style="width: 30px; height: 30px;">

        <div style="
                display: block;
                margin-left:3px;
              ">
          <p style="font-size: 14px; font-weight: 600; margin: 0; margin-bottom:2px;">
            Ticket Type
          </p>
          <p style="color: #b4b4b4; font-size: 14px; margin: 0">in-house</p>
        </div>
      </div>
      <!---venue-->
      <div style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              gap: 0.75rem;
              padding: 1rem 0rem;
            ">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-location-50.png?alt=media&token=c5c31c06-2354-4610-892e-4010986ef03a"
          style="width:30px; height:30px;">

        <div style="
                display:block;
                margin-left:3px;
            
              ">
          <p style="font-size: 14px; font-weight: 600; margin: 0; margin-bottom:2px;">Venue</p>
          <p style="color: #b4b4b4; font-size: 14px; margin: 0">
            ${event.eventAddress}
          </p>
        </div>
      </div>
      <!--Date and Time-->
      <div style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              gap: 0.75rem;
              padding: 1rem 0rem;
            ">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-date-50.png?alt=media&token=9e64baa1-e7eb-49c1-a315-6b7b4979e2bf"
          style="width:30px; height:30px;">
        <div style="
                display: block;
                margin-left:3px;
              ">
          <p style="font-size: 13px; font-weight: 600; margin: 0; margin-bottom:2px;">
            Date & Time
          </p>
          <p style="color: #b4b4b4; font-size: 14px; margin: 0">
            ${format(event.startDateTime, "PPP")} - ${format(
    event.endDateTime,
    "PPP"
  )}
          </p>
        </div>
      </div>
      <!--end-->
      <a href="https://www.zikoro.com/event/${
        event.eventAlias
      }/reception?email=${
    attendee?.email
  }&createdAt=${new Date().toISOString()}&isPasswordless=${true}&alias=${
    attendee?.attendeeAlias
  }" style="max-width:600px; margin:0 auto;">
        <button style="
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
            ">
          <p style="margin:0; width:100%; text-align:center; color:white">Join Event</p>
        </button>
      </a>


      <div style="
                max-width: 600px;
  
                display: block;
                padding-top: 1rem;
                margin: 1rem auto;
                padding-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
                border-top: 1px solid #b4b4b4;
              ">
        <p style="text-transform: uppercase; font-size: 15px; font-weight: 600">
          Order Summary
        </p>
        <div style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
          <p style="font-size: 14px; color: #b4b4b4; width: 50%;">1 Ticket</p>
          <p style="font-size: 14px;  width: 50%; text-align: end;">
            Free
          </p>
        </div>
      </div>

      <div style="
                max-width: 600px;
                margin:0 auto;
                display: block;
                padding-top: 1rem;
                margin: 1rem auto;
                padding-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
              ">
        <p style="font-size: 14px; color: #b4b4b4">
          Do you have question regarding the event? Speak with the event team.
        </p>

        <div style="
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  gap: 0.75rem;
                ">
          ${
            event.organization.eventContactEmail
              ? `<a style="margin-right:15px;" href="mailto:${event.organization.eventContactEmail}">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-mail-48.png?alt=media&token=4e723639-4f5a-4fcc-965d-7d6ce04e203c"
              style="width:30px; height:30px;">
          </a>`
              : ""
          }
          ${
            event.organization.eventPhoneNumber
              ? `<a style="margin-right:15px;" target="_blank" href="tel:${event.organization.eventPhoneNumber}">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-call-50.png?alt=media&token=d2ccb51a-5888-4d6a-ac8d-c893333a520f"
              style="width:30px; height:30px;">
          </a>`
              : ""
          }
          ${
            event.organization.eventWhatsApp
              ? ` <a style="margin-right:15px;" href="https://wa.me/${event.organization.eventWhatsApp}">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-whatsapp-50.png?alt=media&token=5c8670a2-a222-4034-bff6-d3d9d6e53350"
              style="width:30px; height:30px;">
          </a>`
              : ""
          }

        </div>
      </div>

      <div style="max-width:600px; margin:0 auto; font-size: 14px; color: #b4b4b4">
        This event is managed by ${event.organisationName} and powered by
        <a href="www.zikoro.com" style="color: #001fcc">Zikoro</a>. For assistance, visit our
        <a href="www.zikoro.com/help" style="color: #001fcc">help center</a>.
      </div>
      <div style="max-width:600px; margin:0.3rem auto; font-size: 14px; text-align:center;"><a href="#"
          style="color: #001fcc; text-decoration: none;">Privacy Policy </a> | <a href="#"
          style="text-decoration: none; color: #001fcc">Terms and Conditions</a></div>
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
