import { deploymentUrl } from "@/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { organizerEmail, ...restData } = params;

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
        to: {
          email_address: {
            address: params?.email,
            name: "Partner"
          }
        },
        subject: `Profile update notification`,
        htmlbody: `<div>
        <p>Dear ${params?.companyName},</p>

<p>We are delighted to confirm your registration to exhibit at <strong>${
          params?.eventName
        }</strong> as one of our esteemed event partners. </p>

<p>To complete your registration and set up your virtual booth, please click on the following link: ${deploymentUrl}/event/${
          params?.eventAlias
        }/partner/${params?.partnerAlias} </p>

<p>This link will guide you through the necessary steps to finalize your registration and provide all the details required to set up your booth at the event.</p>

<p>If you encounter any issues or have any questions during the registration process, please do not hesitate to contact our team at ${
          organizerEmail || ""
        }.</p>

<p>Thank you once again for your participation. We are eagerly looking forward to seeing you at <strong>${
          params?.eventName
        }</strong>!</p>

<p>Best regards.</p>
        
        </div>`,
      });
      // console.log(resp);

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
