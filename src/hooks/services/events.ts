import { TEvent } from "@/types/events";
import { toast } from "@/components/ui/use-toast";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import { UseGetResult } from "@/types/request";

export const useGetEvents = (): UseGetResult<
  TEvent[],
  "events",
  "getEvents"
> => {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEvents = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TEvent[]>({
        endpoint: "events",
      });

      if (status !== 200) {
        throw data;
      }
      setEvents(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    getEvents,
  };
};

export const useGetEvent = ({
  eventId,
}: {
  eventId: number;
}): UseGetResult<TEvent, "event", "getEvent"> => {
  const [event, setEvent] = useState<TEvent | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEvent = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TEvent>({
        endpoint: `events/${eventId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setEvent(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  return {
    event,
    isLoading,
    error,
    getEvent,
  };
};
