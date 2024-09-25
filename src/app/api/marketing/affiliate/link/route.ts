import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { convertDateFormat } from "@/utils/date";
import { generateAlphanumericHash } from "@/utils/helpers";
import { TEventTransaction } from "@/types";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { affiliateName, organizationName, eventPoster, payload } = params;

      const {
        affiliateEmail,
        eventName,
        Goal,
        validity,
        commissionType,
        commissionValue,
        eventId,
      } = payload;

      const linkCode = generateAlphanumericHash(7);
      const affiliateLink = `${process.env.NEXT_PUBLIC_HOME_URL}/live-events/${eventId}?affiliateCode=${linkCode}`;

      var { SendMailClient } = require("zeptomail");
      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const resp = await client.sendMail({
        from: {
          address: process.env.NEXT_PUBLIC_EMAIL,
          name: organizationName,
        },
        to: [
          {
            email_address: {
              address: affiliateEmail,
              name: "affiliate name",
            },
          },
        ],
        subject: "Your afiliate link is ready",
        htmlbody: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Affiliate Link Email</title>
          <style>
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
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header img {
              max-width: 100%;
              height: auto;
            }
            .content {
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${eventPoster}" alt="Event Poster">
            </div>
            <div class="content">
              <p>Hi ${affiliateName},</p>
              <p>This is your affiliate link to promote <b>${eventName}</b>. It is valid until: <b>${convertDateFormat(
          validity
        )}</b>. You get <b>${
          commissionType === "fixed" ? "NGN" : ""
        }${commissionValue} ${
          commissionType === "percentage" ? "%" : ""
        }</b> commission when your referrals complete the following event goal: <b>${Goal}</b>.</p>
              <p>Here's your link <a href="${affiliateLink}" class="">${affiliateLink}</a></p>
              <p><i>Best regards</i></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ${eventName} Team. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      });

      console.log(`Email sent to ${affiliateEmail}:`, resp);

      const { error } = await supabase
        .from("affiliateLinks")
        .insert({ ...payload, linkCode, affiliateLink });

      console.log(error);

      if (error) throw error;

      return NextResponse.json(
        { msg: "certificate saved successfully" },
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
          status: 400,
        }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Method not allowed" },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const isUsed = searchParams.get("isUsed");
      const userId = searchParams.get("userId");
      const eventId = searchParams.get("eventId");

      // Query for affiliateLinks with optional filters
      const affiliateLinksQuery = supabase
        .from("affiliateLinks")
        .select("*, affiliate!inner(*)");

      if (isUsed) affiliateLinksQuery.eq("isUsed", !!isUsed);
      if (eventId) affiliateLinksQuery.eq("eventId", eventId);
      if (userId) affiliateLinksQuery.eq("userId", userId);

      const { data: affiliateLinksData, error: affiliateLinksError } =
        await affiliateLinksQuery;

      console.log(affiliateLinksData, !!isUsed);

      if (affiliateLinksError) throw affiliateLinksError;

      // Extract the IDs of affiliateLinks to use in the second query
      const affiliateLinkCodes = affiliateLinksData.map(
        (link) => link.linkCode
      );

      // Query for eventTransactions that match the affiliateLinkIds
      const { data: eventTransactionsData, error: eventTransactionsError } =
        await supabase
          .from("eventTransactions")
          .select("*")
          .in("affiliateCode", affiliateLinkCodes)
          .eq("registrationCompleted", true);

      if (eventTransactionsError) throw eventTransactionsError;

      const combinedData = await Promise.all(
        affiliateLinksData.map(async (link) => {
          const eventTransactions = await Promise.all(
            eventTransactionsData
              .filter(
                (transaction) => transaction.affiliateCode === link.linkCode
              )
              .map(async (eventTransaction: TEventTransaction) => {
                const attendeeEmails =
                  eventTransaction.attendeesDetails?.map(
                    ({ email }) => email
                  ) || [];

                console.log(attendeeEmails, "ëmails");

                const { data, error } = await supabase
                  .from("attendees")
                  .select("*")
                  .in("email", attendeeEmails)
                  .eq("eventAlias", eventTransaction.eventAlias);

                if (error || !data) {
                  return { ...eventTransaction, attendeesDetails: [] };
                }

                return { ...eventTransaction, attendeesDetails: data };
              })
          );

          return {
            ...link,
            eventTransactions,
          };
        })
      );

      return NextResponse.json(
        { data: combinedData },
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
