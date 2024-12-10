import { NextRequest } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const runtime = "edge"

export default async function handler(req: NextRequest) {
  downgradeExpiredSubscriptions();
}

async function downgradeExpiredSubscriptions() {
  const currentDate = new Date().toISOString();

  // subscriptions where expirationDate is in the past
  // const { data: expiredSubscriptions, error } = await supabase
  //   .from("subscription")
  //   .select("organizationAlias, subscriptionType, expirationDate")
  //   .lt("expirationDate", currentDate)
  //   .neq("subscriptionType", "free"); // Avoid updating free subscriptions

  // if (error) {
  //   console.error("Error fetching expired subscriptions:", error);
  //   return;
  // }

  // // Loop over expired subscriptions and update their subscriptionType
  // const updates = expiredSubscriptions.map(async (subscription) => {
  //   return supabase
  //     .from("subscription")
  //     .update({ subscriptionType: "free" })
  //     .eq("organizationAlias", subscription.organizationAlias);
  // });

  // // Execute all updates
  // await Promise.all(updates);

  // // update the associated organizations subscription plans
  // const updateOrganization = expiredSubscriptions.map(async (subscription) => {
  //   return supabase
  //     .from("organization")
  //     .update({ subscriptionPlan: "Free" })
  //     .eq("organizationAlias", subscription.organizationAlias);
  // });

  // // Execute all updateOrganization
  // await Promise.all(updateOrganization);
  

  console.log("Expired subscriptions monitor de-activated");
}
