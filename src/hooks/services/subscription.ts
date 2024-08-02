import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

// //create Organization subscription
// export function useCreateOrgSubscription(
//   userId: string,
//   totalPrice: number,
//   currency: string,
//   plan: string,
//   isMonthly: string,
//   initialTotal: string | null,
//   couponCode: string | null,
//   discountAmount: number | null
// ) {
//   async function createOrgSubscription() {
//     try {
//       const userIdNum = Number(userId);
//       const totalPriceNum = Number(totalPrice);
//       const isMonthlyValue = isMonthly === "true" ? "month" : "year";

//       // Format the start date
//       const startDate = new Date();
//       const formattedStartDate = startDate.toISOString().split("T")[0]; // 'YYYY-MM-DD' format
//       const iniPrice = Number(initialTotal)

//       // Calculate the expiration date
//       const expirationDate = new Date(startDate);
//       if (isMonthly === "true") {
//         expirationDate.setDate(expirationDate.getDate() + 30);
//       } else {
//         expirationDate.setDate(expirationDate.getDate() + 365);
//       }
//       const formattedExpirationDate = expirationDate
//         .toISOString()
//         .split("T")[0]; // 'YYYY-MM-DD' format

//       const { data, error, status } = await supabase
//         .from("subscription")
//         .upsert({
//           userId: userIdNum,
//           organizationId: userIdNum,
//           subscriptionType: plan,
//           amountPayed: totalPriceNum,
//           startDate: formattedStartDate,
//           expirationDate: formattedExpirationDate,
//           currency: currency,
//           monthYear: isMonthlyValue,
//           planPrice: iniPrice,
//           discountValue: discountAmount,
//           discountCode: couponCode
//         });

//       if (error) {
//         toast.error(error.message);
//         return;
//       }
//       if (status === 204 || status === 200) {
//         toast.success("Your Subscription has been updated");
//       }
//     } catch (error) {
//       toast.error("An error occurred while creating the subscription");
//     }
//   }

//   return {
//     createOrgSubscription,
//   };
// }



export function useCreateOrgSubscription(
  userId: string,
  totalPrice: number,
  currency: string,
  plan: string,
  isMonthly: string,
  initialTotal: string | null,
  couponCode: string | null,
  discountAmount: number | null,
  orgId: string | null
) {
  async function createOrgSubscription() {
    try {
      const userIdNum = Number(userId);
      const totalPriceNum = Number(totalPrice);
      const isMonthlyValue = isMonthly === "true" ? "month" : "year";
      const initialTotalNum = initialTotal ? Number(initialTotal) : null;
      const discountAmountNum = discountAmount ? Number(discountAmount) : null;
      const orgIdNum = orgId ? Number(orgId) : null;
      // Format the start date
      const startDate = new Date();
      const formattedStartDate = startDate.toISOString().split("T")[0];

      // Calculate the expiration date
      const expirationDate = new Date(startDate);
      if (isMonthly === "true") {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }
      const formattedExpirationDate = expirationDate.toISOString().split("T")[0];

      // Check if a subscription already exists for the user
      const { data: existingSubscription, error: fetchError } = await supabase
        .from("subscription")
        .select("*")
        .eq("organizationId", orgIdNum)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        toast.error(fetchError.message);
        return;
      }

      // If subscription exists, update it; otherwise, insert a new one
      const { data, error, status } = await supabase
        .from("subscription")
        .upsert({
          userId: userIdNum,
          organizationId: existingSubscription ? existingSubscription.id : orgIdNum, // Use the existing org ID if it exists
          subscriptionType: plan,
          amountPayed: totalPriceNum,
          startDate: formattedStartDate,
          expirationDate: formattedExpirationDate,
          currency: currency,
          monthYear: isMonthlyValue,
          planPrice: initialTotalNum,
          discountValue: discountAmountNum,
          discountCode: couponCode
        });

      if (error) {
        toast.error(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Your Subscription has been updated");
      }
    } catch (error) {
      toast.error("An error occurred while creating the subscription");
    }
  }

  return {
    createOrgSubscription,
  };
}