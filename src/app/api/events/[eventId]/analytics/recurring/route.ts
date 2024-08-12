import {
  createRouteHandlerClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Attendee = {
  email: string;
  events: { organisationId: string }[];
};

export async function GET(req: NextRequest) {
  const supabase: SupabaseClient = createRouteHandlerClient({ cookies });

  console.log("here");
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");
  console.log(organizationId);

  if (!organizationId) {
    return NextResponse.json(
      {
        error: "organizationId is required",
      },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("attendees")
      .select("email, events!inner(organisationId)")
      .eq("events.organisationId", organizationId);

    if (error || !data) {
      throw error || new Error("No data returned from Supabase");
    }

    const emailCounts = data.reduce<Record<string, number>>(
      (acc, { email }) => {
        acc[email] = (acc[email] || 0) + 1;
        return acc;
      },
      {}
    );

    const recurringEmails = Object.entries(emailCounts)
      .filter(([_, count]) => count > 1)
      .map(([email, count]) => ({ email, count }));

    const recurringEmailCount = recurringEmails.length;
    console.log({ recurringEmailCount, recurringEmails });
    return NextResponse.json(
      {
        data: {
          recurringEmailCount,
          recurringEmails,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recurring emails:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
