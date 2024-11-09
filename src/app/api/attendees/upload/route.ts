import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToICSFormat, generateQRCode } from "../../payment/route";
import { Event, TAttendee, TOrganization } from "@/types";
import { createICSContent, uploadFile } from "@/utils";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { data: oldUsers, error: oldUsersError } = await supabase
        .from("users")
        .select("*")
        .in(
          "userEmail",
          params.map((user) => user.email)
        );

      if (oldUsersError) throw oldUsersError;

      console.log(
        params.filter(
          (user) =>
            !oldUsers.find((oldUser) => oldUser.userEmail === user.userEmail)
        ),
        "params"
      );

      const { data: users, error: userError } = await supabase
        .from("users")
        .insert(
          params
            .filter(
              (user) =>
                !oldUsers.find((oldUser) => oldUser.userEmail === user.email)
            )
            .map((user) => ({
              firstName: user.firstName || null,
              lastName: user.lastName || null,
              phoneNumber: user.phoneNumber || null,
              jobTitle: user.jobTitle || null,
              organization: user?.organization || null,
              city: user.city || null,
              country: user.country || null,
              linkedin: user.linkedin || null,
              instagram: user.instagram || null,
              facebook: user.facebook || null,
              bio: user.bio || null,
              userEmail: user.email || "ubahyusuf484@gmail.com",
              x: user.x || null,
              created_at: new Date().toISOString(),
            }))
        )
        .select("*");

      console.log(users, "users", userError, "error");

      if (userError) throw userError;

      const { data: attendees, error } = await supabase
        .from("attendees")
        .insert(params)
        .select("*");
      if (error) throw error;

      const { data: event, error: eventSelectError } = await supabase
        .from("events")
        .select("registered")
        .eq("eventAlias", params[0].eventAlias)
        .maybeSingle();

      if (eventSelectError) {
        throw eventSelectError.code;
      }

      if (!event) throw "event not found";

      const { data: currentEvent, error: eventError } = await supabase
        .from("events")
        .update({ registered: event.registered + params.length })
        .eq("eventAlias", params[0].eventAlias)
        .select("*, organization!inner(*)")
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
        eventAlias,
      } = currentEvent as never as Event & { organization: TOrganization };

      console.log(
        startDateTime,
        email,
        eventAddress,
        organisationName,
        eventTitle,
        endDateTime,
        eventPoster
      );

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
      const senderName = "Zikoro";
      const subject = `Invite from to ${eventTitle}`;

      console.log(attendees);

      (attendees as TAttendee[]).forEach(async (attendee: TAttendee) => {
        try {
          const calendarICS = createICSContent(
            startDateTime,
            endDateTime,
            description,
            eventAddress,
            { name: organizationName, email: eventContactEmail },
            {
              name: attendee.firstName + " " + attendee.lastName,
              email: attendee.email,
            }
          );

          console.log(attendee.email, "attendee email");

          const resp = await client.sendMail({
            from: {
              address: senderAddress,
              name: senderName,
            },
            to: [
              {
                email_address: {
                  address: attendee.email,
                  name: attendee.firstName + " " + attendee.lastName,
                },
              },
            ],
            subject,
            htmlbody: `
            <div
           style=" background: "#000000"
          >
            <div
              style="
                max-width: 600px;
                margin: 0 auto;
                display: block;
                padding-bottom: 1rem;
                margin-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
              "
            >
              <p style="font-weight: 600; text-transform: uppercase; font-size: 20px">
                ${eventTitle}
              </p>
              <div style="width: 100%; height: 250px">
                <img
                  src="${eventPoster}"
                  alt="event-image"
                  style="
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                  "
                >
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <p style="font-size: 13px; color: #b4b4b4; width: 50%;">Order Date: ${format(
                  new Date(),
                  "PPP"
                )}</p>
                <p style="font-size: 13px; color: #b4b4b4 width:50%; text-align: end;">Reference <span style="color:black; margin-left:3px; font-weight: 500;">In-house</span></p>
              </div>
            </div>
          <div 
          style="max-width: 600px; margin:0 auto; display: flex;"
          >
          <div
          style="float:left;"
          >
          <!--registeredAttendees[0]-->
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              padding: 1rem 0rem;
              gap: 0.75rem;
              margin: 0;
            "
          >
          <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-user-50.png?alt=media&token=9a491723-d02b-4610-8399-00781c7cb206" style="width: 30px; height: 30px;">
            <div
              style="
                display: block;
               
                gap: 0.4rem;
              "
            >
              <p style="font-size: 14px; font-weight: 600; margin: 0; margin-bottom:2px;">
                Registered Attendee
              </p>
              <p style="color: #b4b4b4; font-size: 14px; margin: 0;">${
                attendee.firstName + " " + attendee.lastName
              }</p>
            
              ${
                event.organization.subscriptionPlan === "free" &&
                `
                <a
                href="https://www.zikoro.com/event/${
                  currentEvent.eventAlias
                }/people/info/${attendee.attendeeAlias}?email=${
                  attendee?.email
                }&createdAt=${new Date().toISOString()}&isPasswordless=${true}&alias=${
                  attendee?.attendeeAlias
                }"
                 
                style="display: block; color: #001fcc; font-size: 12px; text-decoration: none;"
                >
                  Update Profile
              </a>
              `
              } 
            </div>
          </div>
          <!---registration-->
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              padding: 1rem 0rem;
              gap: 0.75rem;
            "
          >
            <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-ticket-50.png?alt=media&token=8c9d3ec1-d450-4d28-8258-692693856667" style="width: 30px; height: 30px;">
    
            <div
              style="
                display: block;
                margin-left:3px;
              "
            >
              <p style="font-size: 14px; font-weight: 600; margin: 0; margin-bottom:2px;">
               Ticket Type
              </p>
              <p style="color: #b4b4b4; font-size: 14px; margin: 0">in-house</p>
            </div>
          </div>
          <!---venue-->
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              gap: 0.75rem;
              padding: 1rem 0rem;
            "
          >
           <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-location-50.png?alt=media&token=c5c31c06-2354-4610-892e-4010986ef03a" style="width:30px; height:30px;">
    
            <div
              style="
                display:block;
                margin-left:3px;
            
              "
            >
              <p style="font-size: 14px; font-weight: 600; margin: 0; margin-bottom:2px;">Venue</p>
              <p style="color: #b4b4b4; font-size: 14px; margin: 0">
                ${eventAddress}
              </p>
            </div>
          </div>
          <!--Date and Time-->
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              gap: 0.75rem;
              padding: 1rem 0rem;
            "
          >
            <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-date-50.png?alt=media&token=9e64baa1-e7eb-49c1-a315-6b7b4979e2bf" style="width:30px; height:30px;">
            <div
              style="
                display: block;
                margin-left:3px;
              "
            >
              <p style="font-size: 13px; font-weight: 600; margin: 0; margin-bottom:2px;">
                Date & Time
              </p>
              <p style="color: #b4b4b4; font-size: 14px; margin: 0">
                ${format(startDateTime, "PPP")} - ${format(endDateTime, "PPP")}
              </p>
            </div>
          </div>
          <!--end-->

          ${
            event.organization.subscriptionPlan === "free" &&
            `<a
            href="https://www.zikoro.com/event/${
              currentEvent.eventAlias
            }/reception?email=${
              attendee?.email
            }&createdAt=${new Date().toISOString()}&isPasswordless=${true}&alias=${
              attendee?.attendeeAlias
            }"
            style="max-width:600px; margin:0 auto;"
            >
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
            <p style="margin:0; width:100%; text-align:center; color:white">Join Event</p>
          </button>
            </a>`
          }
      
            <div
              style="
                max-width: 600px;
  
                display: block;
                padding-top: 1rem;
                margin: 1rem auto;
                padding-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
                border-top: 1px solid #b4b4b4;
              "
            >
              <p style="text-transform: uppercase; font-size: 15px; font-weight: 600">
                Order Summary
              </p>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                <p style="font-size: 14px; color: #b4b4b4; width: 50%;">1 Ticket</p>
                <p style="font-size: 14px;  width: 50%; text-align: end;">
                    Free
                </p>
              </div>
            </div>
      
            <div
              style="
                max-width: 600px;
                margin:0 auto;
                display: block;
                padding-top: 1rem;
                margin: 1rem auto;
                padding-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
              "
            >
              <p style="font-size: 14px; color: #b4b4b4">
                Do you have question regarding the event? Speak with the event team.
              </p>
      
              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  gap: 0.75rem;
                "
              >
              ${
                currentEvent.organization.eventContactEmail
                  ? `<a style="margin-right:15px;" href="mailto:${currentEvent.organization.eventContactEmail}">
                 <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-mail-48.png?alt=media&token=4e723639-4f5a-4fcc-965d-7d6ce04e203c" style="width:30px; height:30px;" >
                </a>`
                  : ""
              }
              ${
                currentEvent.organization.eventPhoneNumber
                  ? `<a style="margin-right:15px;" target="_blank" href="tel:${currentEvent.organization.eventPhoneNumber}">
                 <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-call-50.png?alt=media&token=d2ccb51a-5888-4d6a-ac8d-c893333a520f" style="width:30px; height:30px;">
                </a>`
                  : ""
              }
              ${
                currentEvent.organization.eventWhatsApp
                  ? ` <a style="margin-right:15px;" href="https://wa.me/${currentEvent.organization.eventWhatsApp}">
                  <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-whatsapp-50.png?alt=media&token=5c8670a2-a222-4034-bff6-d3d9d6e53350" style="width:30px; height:30px;" >
                </a>`
                  : ""
              }
               
              </div>
            </div>
      
            <div style="max-width:600px; margin:0 auto; font-size: 14px; color: #b4b4b4">
              This event is managed by ${organisationName} and powered by
              <a href="www.zikoro.com" style="color: #001fcc">Zikoro</a>. For assistance, visit our
              <a href="www.zikoro.com/help" style="color: #001fcc">help center</a>.
            </div>
            <div
            style="max-width:600px; margin:0.3rem auto; font-size: 14px; text-align:center;"
            ><a href="#" style="color: #001fcc; text-decoration: none;">Privacy Policy </a> | <a href="#" style="text-decoration: none; color: #001fcc">Terms and Conditions</a></div>
          </div>
            `,
            attachments: [
              {
                name: "event.ics",
                content: Buffer.from(calendarICS).toString("base64"),
                mime_type: "text/calendar",
              },
            ],
          });
          console.log(`Email sent to ${attendee.email}:`, resp);
        } catch (error) {
          console.error(`Error sending email to ${attendee.email}:`, error);
        }
      });

      return NextResponse.json(
        { msg: "attendee created successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error, "error");
      return NextResponse.json(
        {
          err: JSON.stringify(error),
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

export const dynamic = "force-dynamic";
