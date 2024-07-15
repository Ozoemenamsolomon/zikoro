import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToICSFormat, generateQRCode } from "../payment/route";
import { Event, TOrganization } from "@/types";
import { uploadFile } from "@/utils";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    
    try {
      const params = await req.json();

      if (!params.id) {
        const { data, error: checkIfRegisteredError } = await supabase
          .from("attendees")
          .select("*")
          .eq("email", params.email)
          .eq("eventAlias", params.eventId)
          .maybeSingle();

        

        if (checkIfRegisteredError) throw checkIfRegisteredError?.code;
        if (data) throw "email error";
      }

      const { error } = await supabase
        .from("attendees")
        .upsert({ ...params, eventAlias: params.eventId });

      if (error) {
        
        throw error.code;
      }

      if (!params.id) {
        

        const { data: event, error: eventSelectError } = await supabase
          .from("events")
          .select("registered")
          .eq("eventAlias", params.eventId)
          .maybeSingle();

        if (eventSelectError) {
          
          throw eventSelectError.code;
        }

        if (!event) {
          throw "no event";
        }

        

        const { data: currentEvent, error: eventError } = await supabase
          .from("events")
          .update({ registered: event.registered + 1 })
          .eq("eventAlias", params.eventId)
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

        const ics = require("ics");

        const date = new Date(params.registrationDate);
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

        

        // // Generate QR code
        // const qrCodeB64 = await generateQRCode(
        //   `${params.firstName} ${params.lastName}`
        // );

        // 

        // // generate cloud url
        // const qrCodeUrl = await uploadFile(qrCodeB64, "image");
        // 

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
                address: params.email,
                name: params.firstName,
              },
            },
          ],
          subject: `Confirmation to attend ${eventTitle}`,
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
              <p style="font-size: 13px; color: #b4b4b4; width: 50%;">Order Date: ${formattedDate}</p>
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
              params.firstName + " " + params.lastName
            }</p>
          
            <a
             href="www.zikoro.com/profile" 
            style="display: block; color: #001fcc; font-size: 12px; text-decoration: none;"
            >
            Update Profile</a>
           
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
          <a
          href="www.zikoro.com/event/${currentEvent.eventAlias}/home"
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
          </a>
         
    
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
              content: iCalendarContent,
              mime_type: "text/calendar",
            },
          ],
          
        });
        

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
        //   to: params.email,
        //   subject: `Confirmation to attend ${eventTitle}`,
        //   html: ,
        //   attachments: [
        //     {
        //       filename: "event.ics",
        //       content: iCalendarContent,
        //       contentType: "text/calendar",
        //     },
        //   ],
        // };

        // 

        // await transporter.sendMail(mailData, function (err: any, info: any) {
        //   //  
        //   if (err) {
        //     
        //     // check += " error";
        //     throw err;
        //   } else {
        //     // check += " success";
        //     
        //   }
        // });
      }

      
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

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const { error } = await supabase
        .from("attendees")
        .upsert(params, { onConflict: "id" });
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

    
    try {
      const query = supabase
        .from("attendees")
        .select("*")
        .order("registrationDate", { ascending: false });

      

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
