import { convertDateFormat } from "@/utils/date";
import { generateAlphanumericHash } from "@/utils/helpers";
import {
  createRouteHandlerClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Attendee = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  attendeeAlias: string;
  userId: number;
  userEmail: string;
};

type Affiliate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  attendeeAlias: string;
  userId: number;
  userEmail: string;
  organisationId: number;
};

type Event = {
  eventAlias: string;
  eventTitle: string;
  organisationId: number;
  endDateTime: string;
};

type AffiliateLink = {
  affiliateId: number;
  userId: number;
  eventName: string;
  payOutSchedule: string;
  commissionType: string;
  commissionValue: number;
  goal: string;
  affiliateEmail: string;
  eventId: string;
  validity: string;
};

export async function GET(req: NextRequest) {
  const supabase: SupabaseClient = createRouteHandlerClient({ cookies });

  try {
    const { searchParams } = new URL(req.url);
    const eventAlias = searchParams.get("eventAlias");
    const attendeeAlias = searchParams.get("attendeeAlias");

    console.log(eventAlias, attendeeAlias);

    if (!eventAlias || !attendeeAlias) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Fetch the event by eventAlias
    const { data: event, error: eventError } = await supabase
      .from<Event>("events")
      .select("*")
      .eq("eventAlias", eventAlias)
      .single();

    console.log(event, eventError);

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Search for the affiliate by attendeeAlias
    const { data: affiliate, error: affiliateError } = await supabase
      .from<Affiliate>("affiliates")
      .select("*")
      .eq("attendeeAlias", attendeeAlias)
      .single();

    let affiliateId: number;
    let affiliateData: Affiliate | null = null;

    if (affiliateError || !affiliate) {
      // If the affiliate doesn't exist, create it using data from the attendees table
      const { data: attendee, error: attendeeError } = await supabase
        .from<Attendee>("attendees")
        .select("*")
        .eq("attendeeAlias", attendeeAlias)
        .single();

      if (attendeeError || !attendee) {
        return NextResponse.json(
          { error: "Attendee not found" },
          { status: 404 }
        );
      }

      const {
        data: newAffiliate,
        error: newAffiliateError,
        status,
      } = await supabase
        .from("affiliate")
        .insert({
          firstName: attendee.firstName,
          lastname: attendee.lastName,
          email: attendee.email,
          phoneNumber: attendee.phoneNumber,
          attendeeAlias: attendee.attendeeAlias,
          userId: attendee.userId,
          userEmail: attendee.userEmail,
          organizationId: event.organisationId,
        })
        .select("*")
        .single();

      console.log(newAffiliateError, newAffiliate, status);

      if (newAffiliateError || !newAffiliate) {
        return NextResponse.json(
          { error: "Failed to create affiliate" },
          { status: 500 }
        );
      }

      affiliateId = newAffiliate.id;
      affiliateData = newAffiliate;
    } else {
      // If the affiliate exists, use its ID
      affiliateId = affiliate.id;
      affiliateData = affiliate;
    }

    // Check for an existing affiliateLink for the event
    const { data: affiliateLink, error: affiliateLinkError } = await supabase
      .from<AffiliateLink>("affiliateLinks")
      .select("*")
      .eq("affiliateId", affiliateId)
      .eq("eventId", eventAlias)
      .maybeSingle();

    let affiliateLinkData: AffiliateLink | null = null;

    console.log(affiliateLinkError);

    if (affiliateLinkError || !affiliateLink) {
      const linkCode = generateAlphanumericHash(7);
      const affiliateLink = `${process.env.NEXT_PUBLIC_HOME_URL}/live-events/${eventAlias}?affiliateCode=${linkCode}`;

      // If no affiliateLink exists, create a new one
      const { data: newAffiliateLink, error: newAffiliateLinkError } =
        await supabase
          .from("affiliateLinks")
          .insert({
            affiliateId,
            userId: affiliateData.userId,
            eventName: event.eventTitle,
            payoutSchedule: "zikoro managed",
            commissionType: "percentage",
            commissionValue: 10,
            Goal: "event purchase",
            affiliateEmail: affiliateData.email,
            eventId: eventAlias,
            validity: event.endDateTime,
            linkCode,
            affiliateLink,
            isUsed: false,
          })
          .select()
          .single();

      console.log(newAffiliateLinkError);
      if (newAffiliateLinkError || !newAffiliateLink) {
        return NextResponse.json(
          { error: "Failed to create affiliate link" },
          { status: 500 }
        );
      }

      affiliateLinkData = newAffiliateLink;
    } else {
      affiliateLinkData = affiliateLink;
    }

    console.log(affiliateLinkData);
    var { SendMailClient } = require("zeptomail");
    let client = new SendMailClient({
      url: process.env.NEXT_PUBLIC_ZEPTO_URL,
      token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
    });

    console.log("here");
    const {
      affiliateEmail,
      eventName,
      Goal,
      validity,
      commissionType,
      commissionValue,
      affiliateLink: link,
    } = affiliateLinkData;

    console.log(affiliateLink);

    const resp = await client.sendMail({
      from: {
        address: process.env.NEXT_PUBLIC_EMAIL,
        name: event.organisationName,
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
            <img src="${event.eventPoster}" alt="Event Poster">
          </div>
          <div class="content">
            <p>Hi ${affiliateData.firstName},</p>
            <p>This is your affiliate link to promote <b>${
              event.eventTitle
            }</b>. It is valid until: <b>${convertDateFormat(
        validity
      )}</b>. You get <b>${
        commissionType === "fixed" ? "NGN" : ""
      }${commissionValue} ${
        commissionType === "percentage" ? "%" : ""
      }</b> commission when your referrals complete the following event goal: <b>${Goal}</b>.</p>
            <p>Here's your link <a href="${link}" class="">here</a></p>
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

    console.log(affiliateData, affiliateLinkData);

    return NextResponse.json(
      {
        affiliate: affiliateData,
        affiliateLink: affiliateLinkData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred", theError: error },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
