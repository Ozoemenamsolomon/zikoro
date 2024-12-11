import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createHash, generateAlphanumericHash } from "@/utils/helpers";
import { TAttendee, TAttendeeCertificate } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { eventId } = params;

      const {
        data,
        error: certificateError,
        status,
      } = await supabase
        .from("attendeeCertificates")
        .select("*")
        .eq("eventAlias", eventId);

      if (certificateError) throw certificateError;

      // const attendeeIds = new Set(
      //   certificateData.flatMap(({ attendeeId }) => [].concat(attendeeId))
      // );

      // const { data, error } = await supabase
      //   .from("attendees")
      //   .select("*")
      //   .in("id", Array.from(attendeeIds));

      // if (error) throw error;

      return NextResponse.json(
        { data },
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

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { certificateInfo, attendeeInfo, action } = await req.json();

      let query;

      if (action === "release") {
        query = await supabase
          .from("attendeeCertificates")
          .upsert(
            attendeeInfo.map((attendee: any) => {
              const certificateId = createHash(
                JSON.stringify({ ...certificateInfo, ...attendee })
              );
              return {
                ...certificateInfo,
                ...attendee,
                certificateId,
                certificateURL:
                  "www.zikoro.com/credentials/verify/certificate/" +
                  certificateId,
              };
            }),
            { onConflict: "id" }
          )
          .select("*, attendee:attendees!inner(*)");
      } else {
        query = await supabase
          .from("attendeeCertificates")
          .delete()
          .eq("CertificateGroupId", certificateInfo.CertificateGroupId)
          .in(
            "attendeeId",
            attendeeInfo.map(
              ({ attendeeId }: { attendeeId: number }) => attendeeId
            )
          );
      }

      const { data: certificateData, error } = query;

      if (error) throw error;

      if (action === "release") {
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

        (
          certificateData as (TAttendeeCertificate & { attendee: TAttendee })[]
        ).forEach(
          async (
            certificate: TAttendeeCertificate & { attendee: TAttendee }
          ) => {
            const {
              attendeeEmail,
              certificateURL,
              name,
              attendee: { firstName },
            } = certificate;

            try {
              // For CommonJS
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
                      address: attendeeEmail,
                      name: firstName,
                    },
                  },
                ],
                subject: "Your Certificate is Ready!",
                htmlbody: `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>
                    /* CSS styles */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .heading {
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .content {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 20px;
                    }
                    .link {
                        color: #007bff;
                        text-decoration: none;
                    }
                    .link:hover {
                        text-decoration: underline;
                    }
                </style>
                </head>
                <body>
                    <div class="container">
                        <div class="heading">Dear ${firstName},</div>
                        <div class="content">Great news! Your ${name} certificate is ready for download. Access it now through this link: <a href="${certificateURL}" class="link">Download Certificate</a>.</div>
                        <div class="content">Congratulations!</div>
                        <div class="content">Best,<br>Event Team</div>
                    </div>
                </body>
                </html>
                `,
              });

              // Send email to individual recipient
              // await transporter.sendMail({
              //   from: `Zikoro <${process.env.NEXT_PUBLIC_EMAIL}>`,
              //   to: attendeeEmail,
              //   subject: `Your Certificate is Ready!`,
              //   html: `<!DOCTYPE html>
              //   <html lang="en">
              //   <head>
              //   <meta charset="UTF-8">
              //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
              //   <title>Email Template</title>
              //   <style>
              //     /* CSS styles */
              //     body {
              //       font-family: Arial, sans-serif;
              //       margin: 0;
              //       padding: 0;
              //       background-color: #f4f4f4;
              //     }
              //     .container {
              //       max-width: 600px;
              //       margin: 20px auto;
              //       padding: 20px;
              //       background-color: #fff;
              //       border-radius: 5px;
              //       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              //     }
              //     .heading {
              //       font-size: 24px;
              //       color: #333;
              //       margin-bottom: 20px;
              //     }
              //     .content {
              //       font-size: 16px;
              //       color: #666;
              //       margin-bottom: 20px;
              //     }
              //     .link {
              //       color: #007bff;
              //       text-decoration: none;
              //     }
              //     .link:hover {
              //       text-decoration: underline;
              //     }
              //   </style>
              //   </head>
              //   <body>
              //     <div class="container">
              //       <div class="heading">Dear ${firstName},</div>
              //       <div class="content">Great news! Your ${name} certificate is ready for download. Access it now through this link: <a href="${certificateURL}" class="link">Download Certificate</a>.</div>
              //       <div class="content">Congratulations!</div>
              //       <div class="content">Best,<br>Event Team</div>
              //     </div>
              //   </body>
              //   </html>
              //   `,
              // });

              //
            } catch (error) {
              console.error(`Error sending email to ${attendeeEmail}:`, error);
            }
          }
        );

        // await transporter.sendMail(mailData, function (err: any, info: any) {
        //
        //   if (err) throw err;
        //   else
        // });
      }

      return NextResponse.json(
        {
          data: {
            msg: `certificates ${
              action + (action === "release" ? "d" : "ed")
            } successfully`,
          },
        },
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

export const dynamic = "force-dynamic";
