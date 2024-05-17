import { Organization, TOrganization } from "@/types";
import { create } from "zustand";

interface organizationState {
  organization: TOrganization | null;
  setOrganization: (organization: TOrganization) => void;
}

const useOrganizationStore = create<organizationState>((set) => ({
  organization: null,
  setOrganization: (organization: TOrganization) => set({ organization }),
}));

export default useOrganizationStore;
