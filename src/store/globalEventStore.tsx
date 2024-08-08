import { Event, TOrganization } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface eventState {
  event: (Event & { organization: TOrganization }) | null;
  setEvent: (event: (Event & { organization: TOrganization }) | null) => void;
}

const useEventStore = create<eventState>()(
  persist(
    (set) => ({
      event: null,
      setEvent: (event: (Event & { organization: TOrganization }) | null) =>
        set({ event }),
    }),
    {
      name: "event", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // specify the storage mechanism
    }
  )
);

export default useEventStore;
