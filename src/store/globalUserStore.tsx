import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TUser } from "@/types";

// Define the user state interface
interface userState {
  user: TUser | null;
  loading:boolean;
  setUser: (user: TUser | null) => void;
}

// Create the user store
const useUserStore = create<userState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user: TUser | null) => set({ user, loading: false }),
    }),
    {
      name: "user", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // specify the storage mechanism
    }
  )
);

export default useUserStore;
