import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateAlphanumericHash } from "@/utils/helpers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const query = supabase.from("sentEmails").select("*");

      if (userId) query.eq("userId", userId);

      const { data, error, status } = await query;

      if (error) throw error;

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

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const {
        emailCategory,
        subject,
        sendersName,
        emailBody,
        emailRecipient,
        replyTo,
        eventAlias,
        addCTA,
        CTAText,
        addProfileButton,
        profileButtonText,
        addCustomButton,
        customButtonText,
        customButtonLink,
        enableCTA,
      } = params;

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

      console.log(emailRecipient, "email list");

      const { data: currentEvent, error: eventError } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("eventAlias", eventAlias)
        .maybeSingle();

      if (eventError) throw eventError;

      const emailIdentifier = generateAlphanumericHash(8);

      var { SendMailClient } = require("zeptomail");
      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      emailRecipient.forEach(
        async ({
          attendeeAlias,
          email,
          firstName,
          lastName,
        }: {
          attendeeAlias: string;
          email: string;
          firstName: string;
          lastName: string;
        }) => {
          try {
            const resp = await client.sendMail({
              from: {
                address: process.env.NEXT_PUBLIC_EMAIL,
                name: sendersName,
              },
              to: [
                {
                  email_address: {
                    address: email,
                    name: firstName + " " + lastName,
                  },
                  // client_reference: emailIdentifier,
                  // track_opens: true,
                  // track_clicks: true,
                },
              ],
              subject,
              htmlbody: `<div
      style="
        max-width: 600px;
        margin: 0 auto;
        display: block;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #b4b4b4;
      "
      >
        ${editBody(emailBody, { email, firstName, lastName }, currentEvent)}
        ${
          enableCTA
            ? `
          <div style="display: flex; gap: 10px">
          ${
            addCTA
              ? `<a
            href="https://www.zikoro.com/event/${eventAlias}/reception?email=${email}&createdAt=2024-10-21T12:45:41.444Z&isPasswordless=true&alias=${attendeeAlias}"
            style="
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              margin-right: 10px;
              padding: 0.8rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              text-align: center;
              text-decoration: none;
              background-color: rgb(0, 31, 204);
              border-radius: 6px;
              border: 0;
            "
          >
            <p style="margin: 0; width: 100%; text-align: center; color: white">
              ${CTAText ?? "Join Event"}
            </p>
          </a>`
              : ""
          }
              ${
                addProfileButton
                  ? `<a
            href="https://www.zikoro.com/event/${eventAlias}/people/info/${attendeeAlias}?email=${email}&createdAt=${new Date().toISOString()}&isPasswordless=${true}&alias=${attendeeAlias}"
            style="
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              margin-right: 10px;
              padding: 0.8rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              text-align: center;
              text-decoration: none;
              background-color: rgb(0, 31, 204);
              border-radius: 6px;
              border: 0;
            "
          >
            <p style="margin: 0; width: 100%; text-align: center; color: white">
              ${profileButtonText ?? "Edit Profile"}
            </p>
          </a>`
                  : ""
              }
                  ${
                    addCustomButton
                      ? `<a
            href="${customButtonLink}"
            style="
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              margin-right: 10px;
              padding: 0.8rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              text-align: center;
              text-decoration: none;
              background-color: rgb(0, 31, 204);
              border-radius: 6px;
              border: 0;
            "
          >
            <p style="margin: 0; width: 100%; text-align: center; color: white">
              ${customButtonText ?? "Custom Button"}
            </p>
          </a>`
                      : ""
                  }
        </div>
          `
            : ""
        }
      </div>`,
            });

            // const mailData = {
            //   from: `${sendersName} <${process.env.NEXT_PUBLIC_EMAIL}>`,
            //   to: email,
            //   subject: `${emailCategory} email`,
            //   html: `<div>${emailBody}</div>`,
            //   replyTo,
            // };

            // await transporter.sendMail(mailData, function (err: any, info: any) {
            //
            //   if (err) throw err;
            //   else
            // });

            console.log(resp, "resp");
          } catch (error) {
            console.error(`Error sending email to ${email}:`, error);
          }
        }
      );

      const { error } = await supabase.from("sentEmails").insert({
        emailCategory,
        subject,
        sendersName,
        emailBody,
        emailRecipient,
        replyTo,
        eventAlias,
        emailIdentifier,
      });
      if (error) throw error;

      return NextResponse.json(
        { msg: "email sent successfully" },
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

const editBody = (
  body: string,
  receiver: { email: string; firstName: string; lastName: string },
  event: { eventName: string; eventAddress: string }
) =>
  body.replaceAll(/#{(.*?)#}/g, (match, value) => {
    switch (value.trim()) {
      case "eventName":
        return event.eventName;
      case "eventAddress":
        return event.eventAddress;
      case "attendeeFirstName":
        return receiver.firstName;
      case "attendeeLastName":
        return receiver.lastName;
      case "attendeeFullName":
        return `${receiver.firstName} ${receiver.lastName}`;
      default:
        return match;
    }
  });

export const dynamic = "force-dynamic";
