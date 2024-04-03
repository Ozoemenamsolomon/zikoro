"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  eventBookingValidationSchema,
  organizationSchema,
  newEventSchema,
} from "@/schemas";
import { Event, Organization, TEventTransactionDetail } from "@/types";
import _ from "lodash";
import { getCookie } from "@/hooks";
import { getRequest, postRequest } from "@/utils/api";
import { UseGetResult } from "@/types/request";
import { useGetAttendees } from "@/hooks";
import {
  formatDate,
  formatTime,
  COUNTRIES_CURRENCY,
  dateFormatting,
} from "@/utils";

const supabase = createClientComponentClient();

export const useGetEvents = (): UseGetResult<
  Event[],
  "events",
  "getEvents"
> => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEvents = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<Event[]>({
        endpoint: `events`,
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
}): UseGetResult<Event, "event", "getEvent"> => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEvent = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<Event>({
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

export function useCreateOrganisation() {
  const userData = getCookie("user");
  const [loading, setLoading] = useState(false);

  async function organisation(values: z.infer<typeof organizationSchema>) {
    setLoading(true);

    try {
      const { error, status } = await supabase
        .from("organization")
        .upsert([{ ...values, organizationOwner: userData?.userEmail }]);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast({ description: "Organisation created successfully" });
      }
    } catch (error) {}
  }

  return {
    organisation,
    loading,
  };
}

export function useCreateEvent() {
  const userData = getCookie("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createEvent(values: Event) {
    setLoading(true);

    try {
      const { data, error, status } = await supabase.from("events").upsert([
        {
          ...values,
        },
      ]);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        console.log({ data });
        // router.push(` /events/content/${values.eventAlias}/event`);
        toast({ description: "Event created successfully" });
      }
    } catch (error) {}
  }

  return {
    createEvent,
    loading,
  };
}

export function useUpdateEvent() {
  const [loading, setLoading] = useState(false);

  async function update(values: Partial<Event>, eventId: string) {
    setLoading(true);

    try {
      const { data, error, status } = await supabase
        .from("events")
        .update([
          {
            ...values,
          },
        ])
        .eq("id", eventId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        setLoading(false);

        toast({ description: "Event updated successfully" });
      }
    } catch (error) {}
  }

  async function updateOrg(values: any, orgId: string) {
    setLoading(true);

    try {
      const { data, error, status } = await supabase
        .from("organization")
        .update([
          {
            ...values,
          },
        ])
        .eq("id", orgId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        setLoading(false);

        toast({ description: "Organization updated successfully" });
      }
    } catch (error) {}
  }

  return {
    update,
    updateOrg,
    loading,
  };
}

export function useGetQueries(tableName: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) {
      toast({ variant: "destructive", description: error.message });
      setLoading(false);
      return;
    }
    setData(data);
    setLoading(false);
  }

  return {
    refetch: fetchData,
    loading,
    data,
  };
}

export function useFetchSingleOrganization(id: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Organization | null>(null);

  useEffect(() => {
    fecthSingleOrg();
  }, []);

  async function fecthSingleOrg() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("organization")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast({ variant: "destructive", description: fetchError.message });
        setLoading(false);
        return null;
      }

      setLoading(false);
      setData(data);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }

  return {
    data,
    loading,
    refetch: fecthSingleOrg,
  };
}

export function useFetchOrganizationEvents(id?: string | string[]) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchOrganizationEvents();
  }, []);

  async function fetchOrganizationEvents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organisationId", id);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return null;
      }
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }
  return {
    refetch: fetchOrganizationEvents,
    loading,
    data,
  };
}

export function useDuplicateEvent() {
  const [loading, setLoading] = useState(false);
  async function duplicateEvent(id: number) {
    setLoading(true);
    try {
      // Fetch the event by ID
      const { data: originalEvent, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast({ variant: "destructive", description: fetchError.message });
        setLoading(false);
        return null;
      }

      // Create a new event with the same data
      const newEvent = { ...originalEvent, published: false };
      delete newEvent.id; // delete the id

      // Insert the new event into the events table
      const {
        data: insertedEvent,
        error: insertError,
        status,
      } = await supabase
        .from("events")
        .upsert([{ ...newEvent }], { onConflict: "id" })
        .single();

      if (insertError) {
        toast({ variant: "destructive", description: insertError.message });
        setLoading(false);
        return null;
      }

      if (status === 201 || status === 200) {
        toast({ description: "Event successfully duplicated" });
      }

      //return insertedEvent;
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    duplicateEvent,
    loading,
  };
}

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  async function deleteEvent(id: number) {
    setLoading(true);

    try {
      // Delete the event by ID
      const { data, error, status } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        return false;
      }

      if (status === 204 || status === 200) {
        toast({ description: "Event deleted successfully" });
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    deleteEvent,
    loading,
  };
}

export function useGetPublishedEvents(
  id: string,
  startIndex: number,
  endIndex: number
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [isLastPage, setLastPage] = useState(false);

  useEffect(() => {
    fetchPublishedEvents();
  }, [startIndex, endIndex]);

  async function fetchPublishedEvents() {
    if (startIndex === 0) setLoading(true);
    if (startIndex > 0) setLoadingNextPage(true);

    try {
      const {
        data: responseData,
        error,
        status,
      } = await supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .eq("organisationId", id)
        .range(startIndex, endIndex);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        setLoadingNextPage(false);

        return null;
      }
      if (status === 200 || status === 201) {
        // when the response is empty, it denotes that it  has reached the last page
        if (responseData?.length == 0) {
          setLastPage(true);
          setLoadingNextPage(false);
          return;
        }
        setData((prev) => _.uniqBy([...prev, ...responseData], "id"));

        setLoading(false);
        setLoadingNextPage(false);
      }
    } catch (error) {
      setLoading(false);
      setLoadingNextPage(false);
      return null;
    }
  }

  return {
    data,
    loading,
    loadingNextPage,
    isLastPage,
  };
}

export function useFetchSingleEvent(id: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Event | null>(null);

  useEffect(() => {
    fetchSingleEvent();
  }, []);

  async function fetchSingleEvent() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast({ variant: "destructive", description: fetchError.message });
        setLoading(false);
        return null;
      }

      setLoading(false);
      setData(data);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }

  return {
    data,
    loading,
    refetch: fetchSingleEvent,
  };
}

export function useBookingEvent() {
  const userData = getCookie("user");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  async function registerAttendees(
    eventTransactionRef: string,
    values: z.infer<typeof eventBookingValidationSchema>,
    eventId?: number,
    attendants?: string | null
  ) {
    const { attendeeApplication } = values;

    try {
      const attendees = attendeeApplication.map((attendee) => {
        return {
          ...attendee,
          eventId,
          attendeeType: [attendants],
          registrationDate: new Date(),
          eventRegistrationRef: eventTransactionRef,
          userEmail: userData?.email,
        };
      });

      const { error, status } = await supabase
        .from("attendees")
        .upsert([...attendees]);

      if (error) {
        if (
          error.message ===
          `duplicate key value violates unique constraint "attendees_email_key"`
        ) {
          // toast({variant:"destructive",description:"User has already registered for this event")
        } else {
          toast({ variant: "destructive", description: error.message });
        }

        setIsRegistered(true);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        setIsRegistered(false);
        //  allowPayment(true);
        toast({
          description:
            "Attendees Information has been Captured. Proceed to Payment...",
        });
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    registerAttendees,
    loading,
    isRegistered,
  };
}

export function useTransactionDetail() {
  const [loading, setLoading] = useState(false);
  const userData = getCookie("user");
  async function sendTransactionDetail(
    allowPayment: (bool: boolean) => void,
    values: any
  ) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        userEmail: userData?.email,
        userId: userData?.id,
      };

      const {
        data: successData,
        error,
        status,
      } = await supabase.from("eventTransactions").upsert([{ ...payload }]);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        allowPayment(true);
        // toast({description:"Al");
        //  console.log({successData})
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    sendTransactionDetail,
    loading,
  };
}


export function useGetEventTransactionDetail(eventRegistrationRef: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TEventTransactionDetail>({} as TEventTransactionDetail);

  useEffect(() => {
    fetchEventTransaction();
  }, []);

  async function fetchEventTransaction() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("eventTransactions")
        .select("*")
        .eq("eventRegistrationRef", eventRegistrationRef)
        .single();

      if (fetchError) {
        toast({ variant: "destructive", description: fetchError.message });
        setLoading(false);
        return null;
      }

      setLoading(false);
      setData(data);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }

  return {
    data,
    loading,
    refetch: fetchEventTransaction,
  };
}


export function useUpdateTransactionDetail() {
  const [loading, setLoading] = useState(false);

  async function sendTransactionDetail(
    toggleSuccessModal: (bool: boolean) => void,
    payload: any
  ) {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/payment",
        payload,
      });
      /**
       if (status !== 204) {
       toast({variant:"destructive",description: error.message});
       return;
      }
    */
      if (status === 204 || status === 200) {
        setLoading(false);
        toggleSuccessModal(true);
        toast({ description: "Transaction Successful" });
      }
    } catch (error: any) {
      /// console.log(error)
      toast({
        variant: "destructive",
        description:
          error?.response?.data?.error ||
          "An error occurred while making the request.",
      });
      setLoading(false);
    }
  }

  return {
    sendTransactionDetail,
    loading,
  };
}

export function useRedeemDiscountCode() {
  const [loading, setLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [minAttendees, setMinAttendees] = useState<number | undefined>();

  async function verifyDiscountCode(code: string | undefined, eventId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("discount")
        .select("*")
        .eq("eventId", eventId);

      if (error) {
        setLoading(false);
        throw error;
      }

      // console.log({ data });

      // check if code exist
      let isDiscountCodeExist = data?.map((v) => v.discountCode).includes(code);
      if (!isDiscountCodeExist) {
        toast({
          variant: "destructive",
          description: "Discount code does not exist",
        });
        setLoading(false);
        return;
      }
      // check if status is false
      let discount = data?.find((v) => v.discountCode === code);
      let isDiscountCodeValid = discount?.status;
      if (!isDiscountCodeValid) {
        toast({
          variant: "destructive",
          description: "Discount code has expired",
        });
        setLoading(false);
        return;
      }

      toast({ description: "Discount code has been applied successfully" });
      // check the minQty
      if (isDiscountCodeValid) setMinAttendees(discount?.minQty);

      // setDiscount amount
      if (isDiscountCodeValid) setDiscountAmount(discount?.discountAmount);

      if (isDiscountCodeValid)
        setDiscountPercentage(discount?.discountPercentage);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }

  return {
    verifyDiscountCode,
    loading,
    minAttendees,
    discountAmount,
    discountPercentage,
  };
}

export function useFetchAttendees(id: string) {
  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);
  // Fetch the attendees for an event
  async function fetchData() {
    try {
      const { data, error: fetchError } = await supabase
        .from("attendees")
        .select("*")
        .eq("eventId", id);

      if (fetchError) {
        return null;
      }

      setAttendees(data);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    attendees,
  };
}

export function useEventFeedBack() {
  const [loading, setLoading] = useState(false);

  async function sendFeedback(values: any) {
    setLoading(true);

    try {
      const { error, status } = await supabase
        .from("zikorofeedback")
        .upsert([{ ...values }]);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast({ description: "Thanks... Your feedback has been recieved" });
      }
    } catch (error) {}
  }

  return {
    sendFeedback,
    loading,
  };
}

export function useDiscount() {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function createDiscount(values: any) {
    try {
      setLoading(true);
      const { data, error, status } = await supabase.from("discount").insert([
        {
          ...values,
        },
      ]);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }
      if (status === 201 || status === 200) {
        setLoading(false);
        toast({ description: "Discount created successfully" });
      }
    } catch (error) {}
  }

  async function updateDiscount(value: boolean, orgId: string) {
    try {
      const { data, error, status } = await supabase
        .from("discount")
        .update({ status: value })
        .eq("id", orgId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setUpdating(false);
        return;
      }
      if (status === 204 || status === 200) {
        setUpdating(false);
        toast({ description: "Discount updated successfully" });
      }
    } catch (error) {}
  }

  return {
    loading,
    updating,
    updateDiscount,
    createDiscount,
  };
}

export function useCreateReward() {
  const [loading, setLoading] = useState(false);
  async function createReward(values: any) {
    setLoading(true);

    try {
      const { error, status } = await supabase
        .from("rewards")
        .upsert([{ ...values }]);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast({ description: "Reward created successfully" });
      }
    } catch (error) {}
  }

  return {
    createReward,
    loading,
  };
}

export function useFetchRewards(eventId: string | number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetchRewards();
  }, []);

  async function fetchRewards() {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("rewards")
        .select("*")
        .eq("eventId", eventId);

      if (fetchError) {
        setLoading(false);
        return null;
      }

      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //  console.log(error);
    }
  }

  return {
    data,
    loading,
    refetch: fetchRewards,
  };
}

export function useFormatEventData(event: Event) {
  const startDate = useMemo(
    () => formatDate(event?.startDateTime ?? "0"),
    [event?.startDateTime ?? "0"]
  );
  const endDate = useMemo(
    () => formatDate(event?.endDateTime ?? "0"),
    [event?.endDateTime ?? "0"]
  );

  const startTime = useMemo(
    () => formatTime(event?.startDateTime ?? "0"),
    [event?.startDateTime ?? "0"]
  );
  const endTime = useMemo(
    () => formatTime(event?.endDateTime ?? "0"),
    [event?.endDateTime ?? "0"]
  );

  const removeComma = useMemo(() => {
    return event.eventCity === null || event.eventCountry === null;
  }, [event.eventCity, event.eventCountry]);

  const currency = useMemo(() => {
    if (event?.pricingCurrency) {
      const symbol =
        COUNTRIES_CURRENCY.find(
          (v) => String(v.code) === String(event?.pricingCurrency)
        )?.symbol || "₦";
      return symbol;
    }
  }, [event?.pricingCurrency]);

  const createdAt = useMemo(
    () => dateFormatting(event?.createdAt ?? "0"),
    [event?.createdAt ?? "0"]
  );

  const price = useMemo(() => {
    if (Array.isArray(event?.pricing)) {
      const prices = event?.pricing?.map(({ price }) => Number(price));
      const standardPrice = prices.reduce((lowestPrice, currentPrice) => {
        return currentPrice < lowestPrice ? currentPrice : lowestPrice;
      }, prices[0]);

      return Number(standardPrice)?.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });
    } else {
      return "";
    }
  }, [event?.pricing]);

  return {
    startDate,
    endDate,
    startTime,
    endTime,
    currency,
    removeComma,
    createdAt,
    price,
  };
}

export function useAttenedeeEvents() {
  const { events, isLoading } = useGetEvents();
  const { attendees, isLoading: loading } = useGetAttendees();
  const [registeredEvents, setRegisteredEvents] = useState<Event[] | undefined>(
    []
  );

  useEffect(() => {
    if (!loading && !isLoading) {
      const mappedEventId = attendees?.map((attendee) =>
        Number(attendee?.eventId)
      );
      const filtered = events?.filter((event) => {
        // check if event ID in the attendees data and event ID in the events data correlate
        const isRegistered = mappedEventId?.includes(event?.id);

        return isRegistered;
      });

      setRegisteredEvents(filtered);
    }
  }, [loading, isLoading]);

  return {
    isLoading,
    registeredEvents,
    loading,
  };
}
