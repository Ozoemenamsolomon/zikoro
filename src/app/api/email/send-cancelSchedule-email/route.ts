import { mergeEmailLists } from "@/lib/mergeEmails";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from 'zeptomail';

const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
});

const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
const senderName = "Zikoro";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { bookingFormData } = await req.json();
    console.log('Received bookingFormData:', bookingFormData);

    if (!bookingFormData) {
      console.error('Missing booking form data');
      return NextResponse.json({ error: 'Missing booking form data' }, { status: 400 });
    }

    // Update table
    const newFormdata = { ...bookingFormData, appointmentLinkId: bookingFormData?.appointmentLinkId?.id, bookingStatus:'CANCELLED' };
    delete newFormdata['reason'];
    delete newFormdata['type'];
    delete newFormdata['timeStr'];
    console.log('Updating with data:', newFormdata);

    const { data, error: updatingError } = await supabase
      .from('bookings')
      .update(newFormdata)
      .eq('id', bookingFormData?.id)
      .single();
      console.log({data, updatingError})
    if (updatingError) {
      console.error('Error updating data:', updatingError);
      return NextResponse.json({ error: 'Error updating data: -' + updatingError?.message }, { status: 400 });
    }

    // Extract email-related fields from bookingFormData
    const { userEmail: hostEmail, firstName: hostFirstName, lastName: hostLastName, phoneNumber: hostPhone,} = bookingFormData?.appointmentLinkId?.createdBy;

    const {businessName,logo, locationDetails, note} = bookingFormData.appointmentLinkId;

    const { appointmentName, appointmentDuration, appointmentDate, appointmentTimeStr, firstName, lastName, notes, participantEmail, phone, teamMembers, reason } = bookingFormData;

    const emailList = [participantEmail, hostEmail, ];
    const uniqueEmailArray = mergeEmailLists(teamMembers, emailList);

    const subject = `Cancelled Appointment Details for ${appointmentName}`;
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
            <h1>Cancelled Booking Details</h1>
          </div>
          <div class="content">
          <p>Hi,</p>
          <p>Your appointment with ${hostFirstName} ${hostLastName} has been cancelled. </p>
          <h2>Here is the appointment details</h2>
            <table class="details-table">
              <tr><th>Schedule Name</th><td>${appointmentName}</td></tr>
              <tr>
                <th>Host Organization</th>
                <td>
                  ${businessName}
                  <img src=${logo} alt="logo">
                </td>
              </tr>
              <tr><th>Host Details</th><td>${hostFirstName} ${hostLastName} ${hostPhone}</td></tr>
              <tr><th>Reason for cancellation</th><td>${reason}</td></tr>
              <tr><th>Appointment Location</th><td>${locationDetails}</td></tr>
              <tr><th>Appointment Duration</th><td>${appointmentDuration}mins</td></tr>
              <tr><th>Appointment Date</th><td>${appointmentDate}</td></tr>
              <tr><th>Appointment Time</th><td>${appointmentTimeStr}</td></tr>
              <tr><th>Note from Host</th><td>${note}</td></tr>
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

    try {
        for (const email of uniqueEmailArray) {
          await client.sendMail({
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
            htmlbody: htmlBody,
          });
        }
        console.log('Emails sent successfully');
        return NextResponse.json({ message: 'Emails sent successfully',data }, { status: 200 });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        return NextResponse.json({ error: 'Error sending emails: ' + emailError }, { status: 500 });
      }
    } catch (unhandledError) {
      console.error("Unhandled error:", unhandledError);
      return NextResponse.json(
        { error: "An error occurred while processing the request: " + unhandledError },
        { status: 500 }
      );
    }
  }
