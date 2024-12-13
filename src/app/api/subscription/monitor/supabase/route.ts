import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "GET") {
   
    try {
        const currentDate = new Date().toISOString();
  
        // Fetch subscriptions where expirationDate is in the past
        const { data: expiredSubscriptions, error } = await supabase
          .from("subscription")
          .select("organizationAlias, subscriptionType, expirationDate")
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
            .eq("organizationAlias", subscription.organizationAlias);
        });
      
        // Execute all updates
        await Promise.all(updates);
      
        // update the associated organizations subscription plans
        const updateOrganization = expiredSubscriptions.map(async (subscription) => {
          return supabase
            .from("organization")
            .update({ subscriptionPlan: "Free" })
            .eq("organizationAlias", subscription.organizationAlias);
        });
      
        // Execute all updateOrganization
        await Promise.all(updateOrganization);
        
      
        console.log("Expired subscriptions downgraded to free.");
 

      if (error) throw error;

      return NextResponse.json(
        {
          data:"succes",
        },
        {
          status: 200,
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


async function downgradeExpiredSubscriptions() {
  
  }
  