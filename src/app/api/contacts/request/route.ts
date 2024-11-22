import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Event, TAttendee } from "@/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const payload = await req.json();

      // send mail to both
      const { searchParams } = new URL(req.url);
      const receiverAlias = searchParams.get("receiverAlias");
      const senderEmail = payload.senderUserEmail;
      const receiverEmail = payload.receiverUserEmail;
      const eventAlias = payload.eventAlias;
      const subject = "New contact request";

      var { SendMailClient } = require("zeptomail");

      const client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      //fetch receiver from user table
      const { data: receiver, error: receiverError } = await supabase
        .from("users")
        .select("*")
        .eq("userEmail", receiverEmail)
        .maybeSingle<TAttendee>();

      if (receiverError) throw receiverError;

      if (!receiver) {
        return NextResponse.json(
          { msg: "Receiver not found" },
          { status: 404 }
        );
      }

      //fetch sender from user table
      const { data: sender, error: senderError } = await supabase
        .from("users")
        .select("*")
        .eq("userEmail", senderEmail)
        .maybeSingle<TAttendee>();

      if (senderError) throw senderError;

      if (!sender) {
        return NextResponse.json({ msg: "Sender not found" }, { status: 404 });
      }

      console.log(sender, receiver, "sender and receiver");

      const { error } = await supabase
        .from("contactRequest")
        .insert({ ...payload, status: "pending" });

      if (error) throw error;

      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("eventAlias", eventAlias)
        .maybeSingle<Event>();

      if (eventError) throw eventError;

      if (!event) {
        return NextResponse.json({ msg: "Event not found" }, { status: 404 });
      }

      const link = `https://www.zikoro.com/event/${
        event.eventAlias
      }/people/all?email=${
        receiver.userEmail
      }&createdAt=${new Date().toISOString()}&isPasswordless=${true}&alias=${receiverAlias}`;

      await client.sendMail({
        from: { address: process.env.NEXT_PUBLIC_EMAIL, name: "Zikoro" },
        to: [
          {
            email_address: {
              address: receiverEmail,
              name: receiver?.firstName,
            },
          },
        ],
        subject,
        htmlbody: `
          <div style="padding: 1rem;">
            <div style="max-width: 600px; margin: 0 auto; display: block; padding-bottom: 1rem; border-bottom: 1px solid #b4b4b4;">
              <p style="font-weight: 600; text-transform: uppercase; font-size: 20px; color: white;">
                ${event.eventTitle} - Contact Request
              </p>
              <div style="width: 100%; height: 250px;">
                <img src="${event.eventPoster}" alt="event-image" style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;">
              </div>

              <div>
              <!-- heading -->
              <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">
                Hi <b>${receiver.firstName}</b>
              </h1>
                <p style="font-size: 14px; color: #000; text-align: center; margin-bottom: 10px">
                  You've received a new contact request from Kachi, one of the attendees at the Test Event.
                </p>
                <p style="font-size: 14px; color: #000; text-align: center; margin-bottom: 10px">
                  Visit your profile to view and respond to the request.
                </p>
                  <a href="${link}" style="display: block; text-align: center; margin: 30px 0; padding: 5px 0; background-color: #001fcc; color: #ffffff; font-size: 16px; text-decoration: none; border-radius: 4px; width: 100%">
                    <button style="background-color: #001fcc; color: white; padding: 0.8rem 1.2rem; border-radius: 5px; border: none; cursor: pointer;">
                      Go to my profile
                    </button>
                  </a>
              </div>

              <div style="max-width: 600px; margin: 1rem auto; font-size: 14px; color: #b4b4b4; text-align: center;">
                This event is managed by ${event.organization.organizationName} and powered by <a href="https://www.zikoro.com" style="color: #001fcc;">Zikoro</a>.
              </div>
              <div style="max-width: 600px; margin: 0.5rem auto; font-size: 14px; text-align: center;">
                <a href="https://www.zikoro.com/privacy" style="color: #001fcc; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.zikoro.com/terms" style="text-decoration: none; color: #001fcc;">Terms and Conditions</a>
              </div>
            </div>
          </div>
        `,
      });
      return NextResponse.json(
        { msg: "contact requested successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error.error.details);
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
    try {
      const { searchParams } = new URL(req.url);
      const userEmail = searchParams.get("userEmail");
      const eventAlias = searchParams.get("eventAlias");

      const query = supabase
        .from("contactRequest")
        .select("*")
        .or(
          `receiverUserEmail.eq.${userEmail},senderUserEmail.eq.${userEmail}`
        );

      if (eventAlias) query.eq("eventAlias", eventAlias);
      // .eq("status", "pending");

      const { data, error, status } = await query;

      if (error) throw error;

      const mappedData = await Promise.all(
        data.map(async (item) => {
          const { data: senderData, error: senderError } = await supabase
            .from("users")
            .select("*")
            .eq("userEmail", item.senderUserEmail)
            .maybeSingle();

          if (senderError) throw senderError;

          return { ...item, sender: senderData };
        })
      );

      return NextResponse.json(
        { data: mappedData },
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
