import { createICSContent, deploymentUrl } from "@/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { values, event } = params;
      const { organizerEmail, ...restData } = values;

      const { error, data } = await supabase
        .from("eventPartners")
        .upsert(restData);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          {
            status: 400,
          }
        );
      }

      const calendarICS = createICSContent(
        event?.eventStartDate,
        event?.eventEndDate,
        event?.eventName,
        event?.address,
        { name: event?.organizerName, email: organizerEmail },
        {
          name: values?.companyName,
          email: values.email,
        }
      );

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
              address: values?.email,
              name: values?.companyName,
            },
          },
        ],
        subject: `Profile update notification`,
        htmlbody: `
        <div>
        <div
        style="
                max-width: 600px;
                margin: 0 auto;
                display: block;
                
              "
        >
         <p style="font-weight: 600; text-transform: uppercase; font-size: 20px">
                ${event?.eventName}
              </p>
              <div style="width: 100%; height: 250px">
                <img
                  src="${event?.eventPoster}"
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
                <p style="font-size: 13px; color: #b4b4b4; width: 50%;">Order Date: ${new Date().getDate()}-${
          new Date().getMonth() - 1
        }-${new Date().getFullYear()}</p>
                <p style="font-size: 13px; color: #b4b4b4 width:50%; text-align: end;">Reference <span style="color:black; margin-left:3px; font-weight: 500;">${
                  values?.paymentReference
                }</span></p>
              </div>
              </div>     
              <div
              style="
               max-width: 600px;
  
                display: block;
                padding-top: 1rem;
                margin: 1rem auto;
              "
              >
        <p>Dear ${values?.companyName},</p>

<p>We are delighted to confirm your registration to exhibit at <strong>${
          values?.eventName
        }</strong> as one of our esteemed event partners. </p>

<p>To complete your registration and set up your virtual booth, please click on the following link: ${deploymentUrl}/event/${
          values?.eventAlias
        }/partner/${values?.partnerAlias} </p>

<p>This link will guide you through the necessary steps to finalize your registration and provide all the details required to set up your booth at the event.</p>

<p>If you encounter any issues or have any questions during the registration process, please do not hesitate to contact our team at ${
          organizerEmail || ""
        }.</p>

<p>Thank you once again for your participation. We are eagerly looking forward to seeing you at <strong>${
          values?.eventName
        }</strong>!</p>

<p>Best regards.</p>

</div>
        
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
                <p style="font-size: 14px; color: #b4b4b4; width: 50%;">1x ${
                  values?.tierName} Ticket</p>
                <p style="font-size: 14px;  width: 50%; text-align: end;">${
              Number(values?.amountPaid) > 0
                    ? event?.currency + Number(values?.amountPaid)?.toLocaleString()
                    : "Free"
                }</p>
              </div>
            </div>
        </div>`,
        attachments: [
          {
            name: "event.ics",
            content: Buffer.from(calendarICS).toString("base64"),
            mime_type: "text/calendar",
          },
        ],
      });
      //

      if (error) throw error;

      return NextResponse.json(
        { msg: "Partner created successfully", data },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: error,
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
      const { organizerEmail, ...restData } = params;
      const { error } = await supabase
        .from("eventPartners")
        .update([
          {
            ...restData,
          },
        ])
        .eq("partnerAlias", params?.partnerAlias);

      if (error) {
        return NextResponse.json(
          {
            error: error?.message,
          },
          {
            status: 400,
          }
        );
      }
      if (error) throw error;

      return NextResponse.json(
        { msg: "partner updated successfully" },
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
