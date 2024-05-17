import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createHash, generateAlphanumericHash } from "@/utils/helpers";
import { TAttendee, TAttendeeBadge } from "@/types";

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
        error: badgeError,
        status,
      } = await supabase
        .from("attendeeBadge")
        .select("*")
        .eq("eventAlias", eventId);

      console.log(data);

      if (badgeError) throw badgeError;

      // const attendeeIds = new Set(
      //   badgeData.flatMap(({ attendeeId }) => [].concat(attendeeId))
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
      const { badgeInfo, attendeeInfo, action } = await req.json();

      let query;

      if (action === "release") {
        query = await supabase
          .from("attendeeBadge")
          .upsert(
            attendeeInfo.map((attendee: any) => {
              const badgeId = createHash(
                JSON.stringify({ ...badgeInfo, ...attendee })
              );
              return {
                badgeId,
                badgeURL: "www.zikoro.com/verify/badge/" + badgeId,
                ...badgeInfo,
                ...attendee,
              };
            }),
            { onConflict: "id" }
          )
          .select("*, attendee:attendees!inner(*)");
      } else {
        query = await supabase
          .from("attendeeBadge")
          .delete()
          .eq("BadgeGroupId", badgeInfo.BadgeGroupId)
          .in(
            "attendeeId",
            attendeeInfo.map(
              ({ attendeeId }: { attendeeId: number }) => attendeeId
            )
          );
      }

      const { data: badgeData, error } = query;

      console.log(badgeData);

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

        (badgeData as (TAttendeeBadge & { attendee: TAttendee })[]).forEach(
          async (badge: TAttendeeBadge & { attendee: TAttendee }) => {
            const {
              attendeeEmail,
              badgeURL,
              badgeName,
              attendee: { firstName },
            } = badge;

            try {
              // Send email to individual recipient

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
              <div class="content">Great news! Your ${badgeName} badge is ready for download. Access it now through this link: <a href="${badgeURL}" class="link">Download Badge</a>.</div>
              <div class="content">Congratulations!</div>
              <div class="content">Best,<br>Event Team</div>
            </div>
          </body>
          </html>
          `,
              });

              console.log(resp);

              console.log(`Email sent to ${attendeeEmail}`);
            } catch (error) {
              console.error(`Error sending email to ${attendeeEmail}:`, error);
            }
          }
        );

        // await transporter.sendMail(mailData, function (err: any, info: any) {
        //   console.log(params, "params");
        //   if (err) throw err;
        //   else console.log(info);
        // });
      }

      return NextResponse.json(
        {
          data: {
            msg: `badges ${
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
