import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

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

      // Attempt to update the subscription
      const { error } = await supabase
        .from("subscription")
        .update({
          userId: userId,
          organizationId: orgId,
          subscriptionType: plan,
          amountPayed: totalPriceNum,
          startDate: formattedStartDate,
          expirationDate: formattedExpirationDate,
          currency: currency,
          monthYear: isMonthlyValue,
          planPrice: initialTotalNum,
          discountValue: discountAmountNum,
          discountCode: couponCode,
        })
        .eq("userId", userIdNum)
        .eq("organizationId", orgIdNum);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Your Subscription has been updated");
    } catch (error) {
      toast.error("An error occurred while creating the subscription");
    }
  }

  return {
    createOrgSubscription,
  };
}


export function useGetUserSubscription(id: number, orgId: number) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getUserOrganisation();
  }, []);

  async function getUserOrganisation() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("organization")
        .select("*")
        .eq("organizationOwnerId", id)

      if (fetchError) {
        toast.error(fetchError.message);
        return null;
      }
      setData(data);
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  }
  return {
    data,
    refetch: getUserOrganisation,
    isLoading,
  };
}