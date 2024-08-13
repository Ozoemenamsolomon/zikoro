import {
  createRouteHandlerClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Attendee = {
  email: string;
  eventAlias: string;
  events: { organisationId: string }[];
};

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;
  const supabase: SupabaseClient = createRouteHandlerClient({ cookies });

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");

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
      .select("email, eventAlias, events!inner(organisationId)")
      .eq("events.organisationId", organizationId);

    if (error || !data) {
      throw error || new Error("No data returned from Supabase");
    }

    // Group emails and ensure at least one matches the eventAlias with eventId
    const emailCounts = data.reduce<
      Record<string, { count: number; valid: boolean }>
    >((acc, { email, eventAlias }) => {
      if (!acc[email]) {
        acc[email] = { count: 0, valid: false };
      }
      acc[email].count++;
      if (eventAlias === eventId) {
        acc[email].valid = true;
      }
      return acc;
    }, {});

    // Filter only emails that have more than 1 occurrence and a valid eventAlias
    const recurringEmails = Object.entries(emailCounts)
      .filter(([_, { count, valid }]) => count > 1 && valid)
      .map(([email, { count }]) => ({ email, count }));

    const recurringEmailCount = recurringEmails.length;
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
