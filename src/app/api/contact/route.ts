import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import toast from "react-hot-toast";

type UpdateContactRequestBody = {
  formData: {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    annualEvents: string,
    attendees: string,
    industry: string,
    comments: string,
    source: string
  }
};

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "POST") {
    const body = await req.json() as UpdateContactRequestBody | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    const { formData } = body;
    const fName = formData.firstName;
    const lName = formData.lastName;
    const email = formData.email;
    const phone = formData.phoneNumber;
    const events = formData.annualEvents;
    const attendees = formData.attendees;
    const industry = formData.industry;
    const comments = formData.comments;
    const source = formData.source
    
    console.log(formData)

    try {
      const { data, error } = await supabase
        .from('contactForm')
        .insert({
          firstName: fName,
          lastName: lName,
          email: email,
          source: source,
          phoneNumber: phone,
          annualEvents: events,
          attendees: attendees,
          industry: industry,
          comments: comments,
        });

      if (error) {
        throw error;
      }

      toast.success("Your message has been sent");
    } catch (error) {
      toast.error("Error submitting form, try again later");
    }
  }else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}


export const dynamic = "force-dynamic";

