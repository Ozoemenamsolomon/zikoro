import { NextRequest } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const runtime = "edge"

export default async function handler(req: NextRequest) {
  downgradeExpiredSubscriptions();
}

async function downgradeExpiredSubscriptions() {
  const currentDate = new Date().toISOString();

  // Fetch subscriptions where expirationDate is in the past
  const { data: expiredSubscriptions, error } = await supabase
    .from("subscription")
    .select("organizationId, subscriptionType, expirationDate")
    .lt("expirationDate", currentDate)
    .neq("subscriptionType", "free"); // Avoid updating free subscriptions

  if (error) {
    console.error("Error fetching expired subscriptions:", error);
    return;
  }

  // Loop over expired subscriptions and update their subscriptionType
  const updates = expiredSubscriptions.map(async (subscription) => {
    return supabase
      .from("subscription")
      .update({ subscriptionType: "free" })
      .eq("userId", subscription.organizationId);
  });

  // Execute all updates
  await Promise.all(updates);
  console.log("Expired subscriptions downgraded to free.");
}
