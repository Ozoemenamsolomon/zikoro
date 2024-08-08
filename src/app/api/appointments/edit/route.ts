import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deploymentUrl } from "@/utils";
import { AppointmentLink } from "@/types/appointments";

export async function PUT(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "PUT") {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body: AppointmentLink = await req.json();
    console.log('PUT',{ body });
    let newForm={...body, createdBy:body?.createdBy?.id}
    
    const { data, error } = await supabase
      .from('appointmentLinks')
      .update(newForm)
      .eq('id', body.id)
      .select('*')
      .single();

    if (error) {
      console.error({ error });
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data },
      { status: 201 }
    );
  } catch (error) {
    console.error({ error });

    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}
