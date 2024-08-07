import { generateBookingICS } from "@/lib/generateICS";
import { mergeEmailLists } from "@/lib/mergeEmails";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { addMinutes, parse } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from 'zeptomail';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createICSContent } from "@/utils";

const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
});

const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
const senderName = "Zikoro";

export async function POST(req: NextRequest) {

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const { bookingFormData, appointmentLink } = await req.json();

  try {

    if (!bookingFormData || !appointmentLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { userEmail: hostEmail, organization: hostOrg, firstName: hostfName, lastName: hostlName, phoneNumber: hostPhone, } = appointmentLink.createdBy;

    const { appointmentName, appointmentDuration, appointmentTime, appointmentDate, appointmentTimeStr, firstName, lastName, notes, participantEmail, teamMembers, phone } = bookingFormData;

    const emailList = [participantEmail, hostEmail];
    const uniqueEmailArray = mergeEmailLists(teamMembers, emailList);

    console.log(emailList, uniqueEmailArray, );

    const appointmentDateTime = parse(`${appointmentDate}T${appointmentTime}`, "yyyy-MM-dd'T'HH:mm:ss", new Date());
    const appointmentEndDateTime = addMinutes(appointmentDateTime, appointmentDuration);

    const appointment = {
      start: appointmentDateTime,
      end: appointmentEndDateTime,
      summary: appointmentName,
      description: `Appointment with ${firstName} ${lastName}. Notes: ${notes}`,
      location: appointmentLink?.locationDetails
    };

    const icsContent = generateBookingICS(
      new Date(appointmentDateTime).toISOString(),
      new Date(appointmentEndDateTime).toISOString(),
      appointment?.description,
      appointment?.location,
      {name:`${hostfName} ${hostlName}`,email:hostEmail},
      {name:`${firstName} ${lastName}`,email:participantEmail},
      appointment?.summary,
    );
    

    const icsFilePath = path.join(os.tmpdir(), 'appointment.ics');
    fs.writeFileSync(icsFilePath, icsContent);

    const subject = `Booking Details for ${appointmentName}`;
    const htmlBody = `
          <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }
                .header { text-align: center; background-color: #007bff; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; }
                .header h1 { margin: 0; }
                .content { padding: 20px; }
                .content h2 { color: #007bff; }
                .content p { line-height: 1.6; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
                .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .details-table th, .details-table td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
                .details-table th { background-color: #f2f2f2; }
                .details-table img { max-width: 100px; height: auto; }
                .btn { display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Booking Details</h1>
                </div>
                <div class="content">
                  <p>You have a new appointment booking with the following details:</p>
                  <table class="details-table">
                    <tr><th>Schedule Name</th><td>${appointmentName}</td></tr>
                    <tr>
                      <th>Host Organization</th>
                      <td>
                        ${appointmentLink?.businessName}
                        <img src=${appointmentLink?.logo} alt=logo>
                      </td>
                    </tr>
                    <tr><th>Host Details</th><td>${hostfName} ${hostlName} ${hostPhone}</td></tr>
                    <tr><th>Appointment Location</th><td>${appointmentLink?.locationDetails}</td></tr>
                    <tr><th>Appointment Duration</th><td>${appointmentDuration}mins</td></tr>
                    <tr><th>Appointment Date</th><td>${appointmentDate}</td></tr>
                    <tr><th>Appointment Time</th><td>${appointmentTimeStr}</td></tr>
                    <tr><th>Note from Host</th><td>${appointmentLink?.note}</td></tr>
                    <tr><th>Host Email</th><td>${hostEmail}</td></tr>
                    <tr><th>Participant Email</th><td>${participantEmail}</td></tr>
                    <tr><th>Participant Details</th><td>${firstName} ${lastName} ${phone}</td></tr>
                    <tr><th>Note from Participant</th><td>${notes}</td></tr>
                  </table>
                  <p>Thank you for using our scheduling service.</p>
                  <p>Best Regards,<br>Zikoro<br><br>
                    <img src="https://www.zikoro.com/_next/image?url=%2Fzikoro.png&w=128&q=75" alt="zikoro">
                  </p>
                </div>
                <div class="footer">
                  <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

    const emailPromises = uniqueEmailArray.map(email => {
      return client.sendMail({
        from: {
          address: senderAddress,
          name: senderName,
        },
          to: [{
            email_address: {
              address: email,
              name: "attendee",
            },
          }],
          subject,
          htmlbody: htmlBody,
          attachments: [
            {
              name: 'appointment.ics',
              content: Buffer.from(icsContent).toString('base64'),
              mime_type: 'text/calendar'
            }
          ]
        })
    })

    await Promise.all(emailPromises);

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
