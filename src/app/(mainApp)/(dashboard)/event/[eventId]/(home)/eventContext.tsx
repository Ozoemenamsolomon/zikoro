import { saveCookie, useGetEvent } from "@/hooks";
import { Event } from "@/types";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

const EventContext = createContext<{
  event: Event | null;
  eventIsLoading: boolean;
  getEvent: () => Promise<void>;
}>({ event: null, eventIsLoading: false, getEvent: async () => {} });

const EventContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams();

  const {
    event,
    getEvent,
    isLoading: eventIsLoading,
  } = useGetEvent({
    eventId,
    isAlias: true,
  });

  useEffect(() => {
    
    if (eventIsLoading || !event) return;
    
    saveCookie("event", event);
  }, [eventIsLoading, eventId]);

  return (
    <EventContext.Provider value={{ event, eventIsLoading, getEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);

export default EventContextWrapper;
