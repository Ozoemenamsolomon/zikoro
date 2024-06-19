import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

//create Organization subscription
export function useCreateOrgSubscription(
  userId: string,
  totalPrice: number,
  currency: string,
  plan: string
) {
  async function createOrgSubscription() {
    try {
      const { data, error, status } = await supabase
        .from("subscription")
        .upsert({
          userId: userId,
          organizationId: userId,
          subscriptionType: plan,
          subscriptionStatus: "",
          amountPayed: totalPrice,
          paymentStatus: "Successful",
          paymentMethod: "",
          startDate: new Date(),
          expirationDate: "",
          discountCode: "",
          discountValue: "",
          currency: currency,
          monthYear: "",
        });

      if (error) {
        toast.error(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Your Subscription has been updated");
      }
    } catch (error) {}
  }

  return {
    createOrgSubscription,
  };
}
