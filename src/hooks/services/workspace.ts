import { useState, useEffect } from "react";
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
        toast.success('SubDomain Updated Successfully');
      }
    } catch (error) {
      console.log(error)
    }
  }
  return {
    updateSubdomain
  };
}

export function useTeamMembers(workspaceId: number) {
  const [currentTeamMembers, setCurrentTeamMembers] = useState<any>({ teamMembers: [] });
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);


  // Fetch team members from the database
  async function fetchTeamMembers() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .select("teamMembers")
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

  // Create a new team member
  async function createTeamMember(newTeamMember: any) {
    try {
      const updatedTeamMembers = {
        ...currentTeamMembers,
        teamMembers: [...currentTeamMembers?.teamMembers, newTeamMember],
      };

      const { data, error } = await supabase
        .from("organization")
        .update(updatedTeamMembers)
        .eq("id", workspaceId)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      setCurrentTeamMembers(data);
      toast.success("Team Member Added Successfully");
    } catch (error) {
      console.log(error);
    }
  }

  // Delete a team member
  async function deleteTeamMember(memberId: string) {
    try {
      const teamMembers = currentTeamMembers.teamMembers || [];
      const updatedTeamMembers = teamMembers.filter((member: any) => member.id !== memberId);

      const { data, error } = await supabase
        .from("organization")
        .update({ teamMembers: updatedTeamMembers })
        .eq("id", workspaceId)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentTeamMembers(data);
      toast.error("Team member deleted successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  useEffect(() => {
    fetchTeamMembers();
  }, [workspaceId]);


  async function editTeamMember(memberId: string, updatedMemberData: any) {
    try {
      const updatedTeamMembers = currentTeamMembers.teamMembers.map((member: any) =>
        member.id === memberId ? { ...member, ...updatedMemberData } : member
      );

      const { data, error } = await supabase
        .from("organization")
        .update({ teamMembers: updatedTeamMembers })
        .eq("id", workspaceId)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentTeamMembers(data);
      toast.success("Team member updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function selectTeamMemberForEditing(memberId: string) {
    const memberToEdit = currentTeamMembers.teamMembers.find((member: any) => member.id === memberId);
    setEditingTeamMember(memberToEdit);
  }

  useEffect(() => {
    fetchTeamMembers();
  }, [workspaceId]);

  return {
    currentTeamMembers,
    createTeamMember,
    deleteTeamMember,
    editingTeamMember,
    selectTeamMemberForEditing,
    editTeamMember,
  };
}




