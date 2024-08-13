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
      .select(
        "email, eventAlias, events!inner(organisationId), registrationDate"
      )
      .eq("events.organisationId", organizationId);

    if (error || !data) {
      throw error || new Error("No data returned from Supabase");
    }

    // Group emails and ensure at least one matches the eventAlias with eventId
    const emailCounts = data.reduce<
      Record<
        string,
        { count: number; valid: boolean; registrationDate: Date | null }
      >
    >((acc, { email, eventAlias, registrationDate }) => {
      // First, check if the email is already being processed
      if (!acc[email]) {
        // Check if at least one attendee with the same email has eventAlias matching eventId
        const matchingAttendee = data.find(
          (attendee) =>
            attendee.email === email && attendee.eventAlias === eventId
        );

        if (!matchingAttendee) {
          // If no matching attendee is found, skip this email
          return acc;
        }

        // Initialize the accumulator for this email
        acc[email] = {
          count: 0,
          valid: true,
          registrationDate: new Date(matchingAttendee.registrationDate),
        };
      }

      // Check if the current attendee's registrationDate is after the eventId's registrationDate
      const currentRegDate = new Date(registrationDate);
      if (currentRegDate < acc[email].registrationDate!) {
        acc[email].count++;
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
