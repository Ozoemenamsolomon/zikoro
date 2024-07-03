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

//fetch user organization
export function useGetUserOrganization(id: number) {
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
        .eq("organizationOwnerId", id);
      // .single();

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

//create user Organization
export function useCreateUserOrganization(
  userId: number,
  orgName: string,
  username: string
) {
  async function createUserOrganization() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .upsert({
          organizationOwnerId: userId,
          organizationName: orgName,
          organizationOwner: username,
        });

      if (error) {
        toast.error(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Organization created successfully");
      }
    } catch (error) {}
  }

  return {
    createUserOrganization,
  };
}
