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
        subject: `Confirmation to exhibit at ${event?.eventName}`,
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
                  values?.tierName
                } Ticket</p>
                <p style="font-size: 14px;  width: 50%; text-align: end;">${
                  Number(values?.amountPaid) > 0
                    ? event?.currency +
                      Number(values?.amountPaid)?.toLocaleString()
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
              <a style="margin-right:15px;" href="mailto:${organizerEmail}">
               <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-mail-48.png?alt=media&token=4e723639-4f5a-4fcc-965d-7d6ce04e203c" style="width:30px; height:30px;" >
              </a>
                <a style="margin-right:15px;" target="_blank" href="tel:${
                  event?.organizerPhoneNumber
                }">
                 <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-call-50.png?alt=media&token=d2ccb51a-5888-4d6a-ac8d-c893333a520f" style="width:30px; height:30px;">
                </a>
                <a style="margin-right:15px;" href="https://wa.me/${
                  event?.organizerWhatsappNumber
                }">
                  <img src="https://firebasestorage.googleapis.com/v0/b/preem-whatsapp-cloning-cd897.appspot.com/o/images%2Ficons8-whatsapp-50.png?alt=media&token=5c8670a2-a222-4034-bff6-d3d9d6e53350" style="width:30px; height:30px;" >
                </a>
               
              </div>
            </div>

             <div style="max-width:600px; margin:0 auto; font-size: 14px; color: #b4b4b4">
              This event is managed by ${event?.organizerName} and powered by
              <a href="www.zikoro.com" style="color: #001fcc">Zikoro</a>. For assistance, visit our
              <a href="www.zikoro.com/help" style="color: #001fcc">help center</a>.
            </div>
            <div
            style="max-width:600px; margin:0.3rem auto; font-size: 14px; text-align:center;"
            ><a href="#" style="color: #001fcc; text-decoration: none;">Privacy Policy </a> | <a href="#" style="text-decoration: none; color: #001fcc">Terms and Conditions</a></div>

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
      const { payload, deactivate } = params;
      const { organizerEmail, ...restData } = payload;
      const { error } = await supabase
        .from("eventPartners")
        .update([
          {
            ...restData,
          },
        ])
        .eq("partnerAlias", payload?.partnerAlias);

      var { SendMailClient } = require("zeptomail");
     
      if (deactivate) {
        

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
                address: payload?.email,
                name: payload?.companyName,
              },
            },
          ],
          subject: `Account Deactivation Notification`,
          htmlbody: `
            <div>
            <div
            style="
                   
                    margin: 0 auto;
                    display: block;
                    
                  "
            >
                  <p style="font-weight: 600;">Hi there,</p>
                <br/>
                <br/>
                <p style="text-algin: start;">${deactivate?.reason}</p>
                  </div>
                
    
            </div>`,
        });
      }

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

export const dynamic = "force-dynamic";