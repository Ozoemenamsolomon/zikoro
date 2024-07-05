import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

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
    const {
      orgName,
      orgType,
      orgPlan,
      orgCountry,
      orgTel,
      orgWhatsappNumber,
      orgEmail,
      orgLinkedin,
      orgInstagram,
      orgFacebook,
      orgX
    } = formData;


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
            eventWhatsApp: orgWhatsappNumber,
            eventContactEmail: orgEmail,
            organizationLogo: orgLogoLink,
            // organizationFavicon: orgFaviconLink,
            x: orgX,
            linkedIn: orgLinkedin,
            facebook: orgFacebook,
            instagram: orgInstagram,
          }
        ]
        )
        .eq("organizationName", orgName)
      if (error) {
        console.log(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Workspace Updated");
      }
    } catch (error: any) {
      toast.error(error);
    }
  }
  return {
    updateWorkspace,
  };
}

export function useDeleteWorkspace(orgName: string) {
  async function deleteWorkspace() {
    try {
      // Delete the event by ID
      const { data, error, status } = await supabase
        .from("organization")
        .delete()
        .eq("organizationName", orgName);

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
