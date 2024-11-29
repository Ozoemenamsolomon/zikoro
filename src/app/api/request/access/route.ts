import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const params = await req.json();
      const { email, paymentLink, eventTitle, attendeeName } = params;

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
              address: email,
              name: "Attendee",
            },
          },
        ],
        subject: `Join ${eventTitle}`,
        htmlbody: `<div>

            <div
            max-width: 600px;
            margin: 0 auto;
            display: block;
            margin-bottom: 1rem;
            >
                Dear ${attendeeName}

<p style="
 margin-bottom: 0.5rem;
  margin-top: 2rem;
">Click the button below to access the attendee app.</p>
        <a
        style="width: 130px;"
        href="${paymentLink}"><button 
        
        
         style="
           style="width: 130px;"
           
          
          padding:0.8rem;
          display:flex;
          align-items:center;
          justify-content:center;
            font-size: 14px;
            color: white;
            text-align: center;
            text-decoration: none;
            background-color: rgb(0, 31, 204);
            border-radius: 6px;
            border: 0;
            "
        ><p style="margin:0; width:100%; text-align:center; color:white">Join Event</p></button></a>
            </div>
 </div>`,
      });

      return NextResponse.json(
        { msg: "" },
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
