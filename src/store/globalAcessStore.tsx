import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TUserAccess } from "@/types";

interface accessState {
  userAccess: TUserAccess;
  setUserAccess: (access: TUserAccess) => void;
}

const useAccessStore = create<accessState>()(
  persist(
    (set) => ({
      userAccess: {
        isOrganizer: false,
        isTeamMember: false,
        attendeeId: undefined,
        attendee: undefined,
      },
      setUserAccess: (userAccess: TUserAccess) => set({ userAccess }),
    }),
    {
      name: "access", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // specify the storage mechanism
    }
  )
);

export default useAccessStore;
