import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const payload = await req.json();
      const { searchParams } = new URL(req.url);
      const action = searchParams.get("action");

      const { data, error } = await supabase
        .from("contactRequest")
        .update({ status: action + "ed" })
        .eq("id", payload.contactRequestId)
        .select("*")
        .maybeSingle();

      console.log(data, payload, "payload");

      if (error) throw error;

      if (action === "accept") {
        const { error } = await supabase.from("contacts").insert(payload);

        if (error) throw error;

        const query = supabase
          .from("engagementSettings")
          .select("*")
          .eq("eventAlias", data.eventAlias)
          .maybeSingle();

        const {
          data: engagementsSettings,
          error: engagementSettingsError,
          status,
        } = await query;

        if (engagementSettingsError) {
          return NextResponse.json(
            {
              error: engagementSettingsError?.message,
            },
            {
              status: 400,
            }
          );
        }

        console.log(data.eventAlias, "eventAlias");
        const { data: receiver, error: receiverError } = await supabase
          .from("attendees")
          .select("*")
          .eq("eventAlias", data.eventAlias)
          .eq("email", data.receiverUserEmail)
          .maybeSingle();

        if (receiverError) throw receiverError;

        if (!receiver) {
          throw new Error("No attendee found with that email");
        }

        const { data: sender, error: senderError } = await supabase
          .from("attendees")
          .select("*")
          .eq("email", data.senderUserEmail)
          .eq("eventAlias", data.eventAlias)
          .maybeSingle();

        if (senderError) throw senderError;

        console.log(sender, "sender");

        if (!sender) {
          throw new Error("No attendee found with that email");
        }

        const receiverNewPoints =
          receiver.attendeeProfilePoints +
          (engagementsSettings?.pointsAllocation["Exchange contacts"]
            ?.points ?? 0);

        const senderNewPoints =
          sender.attendeeProfilePoints +
          (engagementsSettings?.pointsAllocation["Exchange contacts"]
            ?.points ?? 0);

        const { error: receiverUpdateError } = await supabase
          .from("attendees")
          .update({
            attendeeProfilePoints: receiverNewPoints,
          })
          .eq("id", receiver.id)
          .eq("eventAlias", data.eventAlias);

        if (receiverUpdateError) throw receiverUpdateError;

        const { error: senderUpdateError } = await supabase
          .from("attendees")
          .update({
            attendeeProfilePoints: senderNewPoints,
          })
          .eq("id", sender.id)
          .eq("eventAlias", data.eventAlias);

        if (senderUpdateError) throw senderUpdateError;
      }

      return NextResponse.json(
        { msg: "contact requested successfully" },
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
