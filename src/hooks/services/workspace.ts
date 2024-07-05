import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

type DBWorkspaceData = {
  id: number;
  created_at: string;
  organizationName: string;
  subscritionStartDate: string;
  subscriptionEndDate: string;
  organizationOwner: string;
  BillingAddress: string;
  TaxID: string;
  payoutAccountDetails: string;
  organizationOwnerId: string;
  organizationType: string;
  organizationLogo: string;
  country: string;
  eventPhoneNumber: string;
  eventWhatsApp: string;
  eventContactEmail: string;
  x: string;
  linkedIn: string;
  instagram: string;
  certificateAsset: string;
  tiktok: string;
  teamMembers: {
    userId: number;
    userEmail: string;
    userRole: string;
  };
};

interface FormDataType {
  orgName: string,
  orgType: string,
  orgPlan: string,
  orgCountry: string,
  orgWhatsappNumber: string,
  orgTel: string,
  orgEmail: string,
  orgLinkedin: string,
  orgInstagram: string,
  orgFacebook: string,
  orgX: string
}

export function useUpdateWorkspace(workspaceId: number, formData: FormDataType, orgLogoLink: string, orgFaviconLink: string) {
  async function updateWorkspace() {
    const orgName = formData.orgName
    const orgType = formData.orgType
    const orgPlan = formData.orgPlan
    const orgCountry = formData.orgCountry
    const orgTel = formData.orgTel
    const orgWhatsapp = formData.orgWhatsappNumber
    const orgEmail = formData.orgEmail
    const orgLinkedin = formData.orgLinkedin
    const orgInstagram = formData.orgInstagram
    const orgFacebook = formData.orgFacebook
    const orgX = formData.orgX

    try {
      const { data, error, status } = await supabase
        .from("organization")
        .update([
          {
            organizationName: orgName,
            organizationType: orgType,
            subscriptionPlan: orgPlan,
            country: orgCountry,
            eventPhoneNumber: orgTel,
            eventWhatsApp: orgWhatsapp,
            eventContactEmail: orgEmail,
            organizationLogo: orgLogoLink,
            // organizationFavicon: orgFaviconLink,
            x: orgX,
            linkedIn: orgLinkedin,
            facebook: orgFacebook,
            instagram: orgInstagram,
          },
        ])
        .eq("id", workspaceId)
        .eq("organizationName", orgName)
      if (error) {
        console.log(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Workspace Updated");
      }
    } catch (error:any) {
      toast.error(error);
    }
  }
  return {
    updateWorkspace,
  };
}

export function useDeleteWorkspace(workspaceId: number) {
  const [loading, setLoading] = useState(false);
  async function deleteWorkspace() {
    setLoading(true);
    try {
      // Delete the event by ID
      const { data, error, status } = await supabase
        .from("organization")
        .delete()
        .eq("id", workspaceId);

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (status === 204 || status === 200) {
        toast.success("Workspace deleted successfully");
      }
    } catch (error) {
      console.log(error)
    }
  }
  return {
    deleteWorkspace,
  };
}
