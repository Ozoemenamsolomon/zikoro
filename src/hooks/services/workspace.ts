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
        .update(
          {
            organizationName: orgName,
            organizationType: orgType,
            subscriptionPlan: orgPlan,
            country: orgCountry,
            eventPhoneNumber: orgTel,
            eventWhatsApp: orgWhatsappNumber,
            eventContactEmail: orgEmail,
            organizationLogo: orgLogoLink,
            favicon: orgFaviconLink,
            x: orgX,
            linkedIn: orgLinkedin,
            facebook: orgFacebook,
            instagram: orgInstagram,
          }
        )
        .eq("id", workspaceId)
        .select()
        .maybeSingle()

      console.log(data)
      if (error) {
        console.log(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Workspace Updated");
        return data
      }
    } catch (error: any) {
      toast.error(error);
    }

  }
  return {
    updateWorkspace,
  };
}

export function useDeleteWorkspace(workspaceId: number) {
  async function deleteWorkspace(): Promise<Boolean> {
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
        return true;
      } else {
        toast.error("Unexpected status code: " + status);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return {
    deleteWorkspace,
  };
}

export function useCreateDomain(workspaceId: number, workspaceSubdomain: string) {
  async function createDomain() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .update({
          subDomain: workspaceSubdomain
        })
        .eq("id", workspaceId);

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (status === 204 || status === 200) {
        toast.success('Created Successfully');
      }
    } catch (error) {
      console.log(error)
    }
  }
  return {
    createDomain
  };
}

export function useUpdateSubdomain(workspaceId: number, workspaceSubdomain: string) {
  async function updateSubdomain() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .update({
          subDomain: workspaceSubdomain
        })
        .eq("id", workspaceId);

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (status === 204 || status === 200) {
        toast.success('Updated Successfully');
      }
    } catch (error) {
      console.log(error)
    }
  }
  return {
    updateSubdomain
  };
}


export function useCreateTeamMember(workspaceId: number) {
  const [currentTeamMembers, setCurrentTeamMembers] = useState<any>({})
  async function createTeamMember(payload?: any) {
    try {
      if (payload) {
        const { data, error } = await supabase
          .from('organization')
          .update(payload)
          .eq("id", workspaceId);

        if (error) {
          toast.error(error.message)
        }
        toast.success('Team Member Added Successfully');
        setCurrentTeamMembers(data);
      } else {
        const { data, error, status } = await supabase
          .from("organization")
          .select()
          .eq("id", workspaceId)
          .single();

        if (error) {
          toast.error(error.message);
          return false;
        }

        if (status === 204 || status == 200) {
          setCurrentTeamMembers(data);
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    createTeamMember();
  }, [workspaceId]);

  return {
    currentTeamMembers,
    createTeamMember,
  };
}


export function useDeleteTeamMember(workspaceId: number) {
  const [currentTeamMembers, setCurrentTeamMembers] = useState<any>({});

  async function fetchTeamMembers() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .select()
        .eq("id", workspaceId)
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }
      if (status === 200 || status === 204) {
        setCurrentTeamMembers(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTeamMember(memberId: string) {
    try {
      const updatedTeamMembers = currentTeamMembers.teamMembers.filter((member: any) => member.id !== memberId);

      const { data, error } = await supabase
        .from("organization")
        .update({ teamMembers: updatedTeamMembers })
        .eq("id", workspaceId)
        .single();

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentTeamMembers(data);
      toast.error("Team member removed successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return {
    currentTeamMembers,
    deleteTeamMember,
    fetchTeamMembers,
  };
}