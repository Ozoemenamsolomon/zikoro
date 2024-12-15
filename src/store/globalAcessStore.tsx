import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TUserAccess } from "@/types";

interface accessState {
  userAccess: TUserAccess | null;
  setUserAccess: (access: TUserAccess | null) => void;
}

const useAccessStore = create<accessState>()(
  persist(
    (set) => ({
      userAccess: null,
      setUserAccess: (userAccess: TUserAccess | null) => set({ userAccess }),
    }),
    {
      name: "access", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // specify the storage mechanism
    }
  )
);

export default useAccessStore;
