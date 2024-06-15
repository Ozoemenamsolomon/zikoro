import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

type organisationSchema = {
  id: number;
  created_at: string;
  organizationName: string;
  organizationSlug: string;
  subscriptionPlan: string;
  subscritionStartDate: string;
  subscriptionEndDate: string;
  organizationOwner: string;
  BillingAddress: string;
  TaxID: string;
  organizationOwnerId: number;
  organizationType: string;
  organizationLogo: string;
  country: string;
  eventPhoneNumber: string;
  eventWhatsApp: string;
  eventContactEmail: string;
  x: string;
  linkedIn: string;
  instagram: string;
  facebook: string;
};

export function useGetUserOrganization(id: number) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getUserOrganisation();
  }, []);

  async function getUserOrganisation() {
    try {
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("organization")
        .select("*")
        .eq("organizationOwnerId", id)
        // .single();

      if (fetchError) {
        toast.error(fetchError.message);
        return null;
      }
      setData(data);
    } catch (error) {
      return null;
    }
  }
  return {
    data,
    refetch: getUserOrganisation,
  };
}
