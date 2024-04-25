import { uploadFile } from "@/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // intialize qrcode
  const QRCode = require("qrcode");

  // intialize ics
  const ics = require("ics");

  if (req.method === "POST") {
    try {
      const params = await req.json();
      const {
        count,
        startDate,
        endDate,
        address,
        organizerContact,
        organization,
        eventImage,
        ...restItem
      } = params;
      const {
        currency,
        eventId,
        ticketCategory,
        event,
        eventRegistrationRef,
        amountPaid,
        attendeesDetails,
        paymentDate,
        eventDate,
      } = params;

      const date = new Date(paymentDate);
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
      const icsDateFormat = convertToICSFormat(eventDate);
      //

      // get attendees names
      const attendeesNames = attendeesDetails.map(
        (
          {
            firstName,
            lastName,
            email,
          }: { firstName: string; lastName: string; email: string },
          index: number
        ) => {
          return {
            name: `${firstName} ${lastName}`,
            email,
          };
        }
      );

      // Create iCalendar event
      const icsEvent = {
        ...icsDateFormat,
        title: event,
        location: address,
        attendees: attendeesNames,
        organizer: { name: organization, email: "me@gmail.com" },
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

      const { error: firstError, status: firstStatus } = await supabase
        .from("eventTransactions")
        .update(restItem)
        .eq("eventRegistrationRef", params.eventRegistrationRef);

      if (firstError) {
        throw firstError;
      }

      let check = "testing this";

      // if (status === 204 || status === 200) {
      // To  update the bookedSpot

      // fetch event
      // Fetch the event by ID
      const { data: originalEvent, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.eventId)
        .single();

      const registered =
        originalEvent.registered === null
          ? params.attendees
          : Number(originalEvent?.registered) + params.attendees;
      const { error, status } = await supabase
        .from("events")
        .update({ ...originalEvent, registered })
        .eq("id", params.eventId);

      // create attendee arraY
      const resolveAttendees = attendeesDetails.map(
        ({
          email,
          firstName,
          lastName,
        }: {
          email: string;
          firstName: string;
          lastName: string;
        }) => {
          return new Promise(async (resolve) => {
            // Generate QR code
            const qrCodeB64 = await generateQRCode(`${firstName} ${lastName}`);

            // generate cloud url
            const qrCodeUrl = await uploadFile(qrCodeB64, "image");

            resolve({
              email,
              name: `${firstName} ${lastName}`,
              qrCode: qrCodeUrl,
            });
          });
        }
      );

      const registeredAttendees: {
        email: string;
        name: string;
        qrCode: string;
      }[] = await Promise.all(resolveAttendees);
      // sending email
      let nodemailer = require("nodemailer");
      console.log({ registeredAttendees });
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
      });

      const mailData = {
        from: `Zikoro <${process.env.NEXT_PUBLIC_EMAIL}>`,
        to: registeredAttendees[0].email,
        subject: `Confirmation to attend ${event}`,
        html: `
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
              ${event}
            </p>
            <div style="width: 100%; height: 250px">
              <img
                src="${eventImage}"
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
              <p style="font-size: 13px; color: #b4b4b4 width:50%; text-align: end;">Reference <span style="color:black; margin-left:3px; font-weight: 500;">${eventRegistrationRef}</span></p>
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
              registeredAttendees[0]?.name
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
            <p style="color: #b4b4b4; font-size: 14px; margin: 0">${ticketCategory}</p>
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
              ${address}
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
              ${startDate} - ${endDate}
            </p>
            <div style="display: flex; align-items: center; gap: 0.5rem">
              <p style="color: #b4b4b4; font-size: 14px; margin: 0;">Add to</p>
              <a
                style="text-decoration: none; color: #001fcc; font-size: 14px; margin-left:3px;"
                href="#"
                >Google</a
              >
            </div>
          </div>
        </div>
        <!--end-->
        </div>
        <img
        style="width: 200px; height: 200px; float: right;"
        src=${registeredAttendees[0]?.qrCode}
          alt="qrcode" />
        </div>
          <a
          href="www.zikoro.com/event/${eventId}/home"
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
              <p style="font-size: 14px; color: #b4b4b4; width: 50%;">${count}x ${ticketCategory} Ticket</p>
              <p style="font-size: 14px;  width: 50%; text-align: end;">${
                amountPaid > 0
                  ? "NGN" + Number(amountPaid)?.toLocaleString()
                  : "Free"
              }</p>
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
            <a style="margin-right:15px;" href="mailto:${
              organizerContact?.email
            }">
             <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-mail-48.png?alt=media&token=4e723639-4f5a-4fcc-965d-7d6ce04e203c" style="width:30px; height:30px;" >
            </a>
              <a style="margin-right:15px;" target="_blank" href="tel:${
                organizerContact?.phoneNumber
              }">
               <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-call-50.png?alt=media&token=d2ccb51a-5888-4d6a-ac8d-c893333a520f" style="width:30px; height:30px;">
              </a>
              <a style="margin-right:15px;" href="https://wa.me/${
                organizerContact?.whatsappNumber
              }">
                <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-whatsapp-50.png?alt=media&token=5c8670a2-a222-4034-bff6-d3d9d6e53350" style="width:30px; height:30px;" >
              </a>
             
            </div>
          </div>
    
          <div style="max-width:600px; margin:0 auto; font-size: 14px; color: #b4b4b4">
            This event is managed by ${organization} and powered by
            <a href="www.zikoro.com" style="color: #001fcc">Zikoro</a>. For assistance, visit our
            <a href="www.zikoro.com/help" style="color: #001fcc">help center</a>.
          </div>
          <div
          style="max-width:600px; margin:0.3rem auto; font-size: 14px; text-align:center;"
          ><a href="#" style="color: #001fcc; text-decoration: none;">Privacy Policy </a> | <a href="#" style="text-decoration: none; color: #001fcc">Terms and Conditions</a></div>
        </div>
          `,
        // attachments: [
        //   {
        //     filename: "event.ics",
        //     content: iCalendarContent,
        //     contentType: "text/calendar",
        //   },
        // ],
      };

      await transporter.sendMail(mailData, function (err: any, info: any) {
        console.log({ attendee: registeredAttendees[0], mailData });
        if (err) {
          console.log({ error });
          check += " error";
          throw err;
        } else {
          check += " success";
          console.log({ info });
          console.log({ check });
        }
      });

      // for (let attendee of registeredAttendees) {

      // }

      return NextResponse.json(
        { msg: "Transaction details updated successfully", check },
        {
          status: 200,
        }
      );
    } catch (error: any) {
      console.error({ error });
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }

  // Function to generate QR code
  async function generateQRCode(eventId: string) {
    try {
      return await QRCode.toDataURL(eventId.toString());
    } catch (error) {
      throw new Error("Error generating QR code: " + error);
    }
  }
}

const convertToICSFormat = (
  dateTimeString: string
): { start: number[]; duration: { hours: number; minutes: number } } => {
  const dateTime = new Date(dateTimeString);

  // Extract date components
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();

  // Extract time components
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  return {
    start: [year, month, day, hours, minutes],
    duration: { hours: 6, minutes: 30 },
  };
};
