import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type UpdateContactRequestBody = {
  formData: object;
};

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "POST") {
    const body = await req.json() as UpdateContactRequestBody | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    const { formData } = body;


    try {
      const { data, error } = await supabase
        .from('contactForm')
        .insert([formData]);

      if (error) {
        throw error;
      }

      return NextResponse.json({ message: "Sent successfully." });
    } catch (error) {
      return NextResponse.json({ error: "Internal server error." });
    }
  }
}
