import { Event, TOrganization } from "@/types";
import { create } from "zustand";

interface eventState {
  event: (Event & { organization: TOrganization }) | null;
  setEvent: (event: Event & { organization: TOrganization }) => void;
}

const useEventStore = create<eventState>((set) => ({
  event: null,
  setEvent: (event: Event & { organization: TOrganization }) => set({ event }),
}));

export default useEventStore;
