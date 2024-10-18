// Next.js API route to handle ZeptoMail webhooks
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const {
      email_info: { client_reference, to, processed_time },
    } = params;

    // Check if the event is an 'email opened' event
    console.log(
      `Email with ID ${client_reference} for user ${to} was opened at ${new Date(
        processed_time * 1000
      )}`
    );

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
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
}
    /*  */