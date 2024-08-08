import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOrganization } from "@/types";

// Define the organization state interface
interface organizationState {
  organization: TOrganization | null;
  setOrganization: (organization: TOrganization | null) => void;
}

// Create the organization store
const useOrganizationStore = create<organizationState>()(
  persist(
    (set) => ({
      organization: null,
      setOrganization: (organization: TOrganization | null) =>
        set({ organization }),
    }),
    {
      name: "organization", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // specify the storage mechanism
    }
  )
);

export default useOrganizationStore;
