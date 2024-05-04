import { Event } from "@/types";
import { create } from "zustand";

interface eventState {
  event: Event | null;
  setEvent: (event: Event) => void;
}

const useEventStore = create<eventState>((set) => ({
  event: null,
  setEvent: (event: Event) => set({ event }),
}));

export default useEventStore;
