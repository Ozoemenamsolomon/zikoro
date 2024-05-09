import { Event, TOrganization } from "@/types";
import { create } from "zustand";

interface eventState {
  event: (Event & { organization: TOrganization }) | null;
  setEvent: (event: Event) => void;
}

const useEventStore = create<eventState>((set) => ({
  event: null,
  setEvent: (event: Event) => set({ event }),
}));

export default useEventStore;
