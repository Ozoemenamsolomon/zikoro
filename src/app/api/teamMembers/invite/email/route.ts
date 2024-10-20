import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
    if (req.method === "POST") {
        try {
            const params = await req.json();
            const {
                organizationName,
                organizationOwner,
                subject,
                emailBody,
                emailRecipient,
            } = params;

            var { SendMailClient } = require("zeptomail");
            let client = new SendMailClient({
                url: process.env.NEXT_PUBLIC_ZEPTO_URL,
                token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
            });

            try {
                const resp = await client.sendMail({
                    from: {
                        address: process.env.NEXT_PUBLIC_EMAIL,
                        name: organizationName,
                    },
                    to: [
                        {
                            email_address: {
                                address: emailRecipient,
                                name: "Team Invite",
                            },
                        },
                    ],
                    subject,
                    htmlbody: `<div>${emailBody}</div>`,
                });


            } catch (error) {
                console.error(`Error sending email to ${emailRecipient}:`, error);
            }

            const { error } = await supabase.from("sentEmails").insert({
                sendersName: organizationName,
                subject: subject,
                emailBody: emailBody,
                emailRecipient: emailRecipient

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

export const dynamic = "force-dynamic";
