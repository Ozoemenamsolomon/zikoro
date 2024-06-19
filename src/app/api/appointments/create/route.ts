import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deploymentUrl } from "@/utils";

// Define the request body type
interface RequestBody {
  // Add the expected properties of the request body here
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "POST") {
    return NextResponse.json(
      { error: 'Method not allowed' },
      {
        status: 405,
      }
    );
  }

  try {
    const body: RequestBody = await req.json();
    console.log({ body });

    const {data,error} = await supabase.from('appointmentLinks').insert([body]).select('*').single()

    return NextResponse.json(
      {data,error},
      {status: 201,}
    );
  } catch (error) {
    console.error({ error });

    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      {
        status: 500,
      }
    );
  }
}
