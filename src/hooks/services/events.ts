"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { eventBookingValidationSchema, organizationSchema } from "@/schemas";
import useUserStore from "@/store/globalUserStore";
import {
  Event,
  Organization,
  TAttendee,
  TEventTransactionDetail,
  TOrgEvent,
} from "@/types";
import _ from "lodash";
import {  useUpdateAttendees } from "@/hooks";
import { getRequest, postRequest, patchRequest } from "@/utils/api";
import { UseGetResult } from "@/types/request";
import { useGetAllAttendees, useGetEventAttendees } from "@/hooks";
import toast from "react-hot-toast";
import {
  formatDate,
  formatTime,
  COUNTRIES_CURRENCY,
  dateFormatting,
  generateAlias,
} from "@/utils";
import { useGetOrganizations } from "./organization";
import useUserStore from "@/store/globalUserStore";

const supabase = createClientComponentClient();

export const useGetEvent = ({
  eventId,
  isAlias = false,
}: {
  eventId?: number;
  isAlias?: boolean;
}): UseGetResult<Event, "event", "getEvent"> => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEvent = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<Event>({
        endpoint: `events/${eventId}?isAlias=${isAlias ? 1 : 0}`,
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

export const useGetUserEvents = ({
  userId = 0,
  organisationId,
}: {
  userId?: number;
  organisationId: number;
}): UseGetResult<TOrgEvent[], "events", "getUserEvents"> => {
  const [events, setEvents] = useState<TOrgEvent[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getUserEvents = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrgEvent[]>({
        endpoint: `/events${userId ? "?userId=" + userId + "&" : "&"}${
          organisationId ? "?organisationId=" + organisationId : ""
        }`,
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
    getUserEvents();
  }, [organisationId]);

  return {
    events,
    isLoading,
    error,
    getUserEvents,
  };
};

export const useGetEvents = (): UseGetResult<
  TOrgEvent[],
  "events",
  "getEvents"
> => {
  const [events, setEvents] = useState<TOrgEvent[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEvents = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrgEvent[]>({
        endpoint: `/events`,
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

export function useCreateOrganisation() {
  const {user: userData} = useUserStore();
  const [loading, setLoading] = useState(false);

  async function organisation(values: z.infer<typeof organizationSchema>) {
    setLoading(true);

    try {
      const { error, status } = await supabase.from("organization").upsert([
        {
          ...values,
          organizationOwner: userData?.userEmail,
          organizationOwnerId: userData?.id,
          teamMembers: [
            {
              userId: userData?.id,
              userEmail: userData?.userEmail,
              userRole: "owner",
            },
          ],
        },
      ]);

      if (error) {
        toast.error(error.message);

        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast.success("Organisation created successfully");
      }
    } catch (error) {}
  }

  return {
    organisation,
    loading,
  };
}

export function useGetUserHomePageEvents() {
  const {user: userData } = useUserStore()
  const [userEvents, setUserEvents] = useState<TOrgEvent[]>([] as TOrgEvent[]);
  const [firstSetEvents, setFirstSetEvents] = useState<TOrgEvent[]>(
    [] as TOrgEvent[]
  );
  const [loading, setLoading] = useState(true);
  const {
    organizations,
    getOrganizations,
    isLoading: orgLoading,
  } = useGetOrganizations();
  const { events, getEvents, isLoading } = useGetEvents();

  async function refetch() {
    getEvents();
    getOrganizations();
  }
  useEffect(() => {
    if (!isLoading && !orgLoading && events && organizations) {
      setLoading(false);
      // checking if the user is a team member of any of the organizations
      // getting the organization id
      const filteredOrganizations = organizations?.filter((organization) => {
        return organization.teamMembers?.some(
          ({ userEmail }) => userEmail === userData?.userEmail
        );
      });

      const organizationIds = filteredOrganizations.map(({ id }) => id);

      // getting events that matches those organization ids
      const matchingEvents = events?.filter((event) => {
        return organizationIds.includes(Number(event?.organisationId));
      });

      const firstSet = events?.filter((event) => {
        return Number(organizationIds[0]) === Number(event?.organisationId);
      });

      setFirstSetEvents(firstSet);

      setUserEvents(matchingEvents);
    }
  }, [events, organizations]);

  // returning the events

  return {
    events: userEvents,
    firstOrganizationEvents: firstSetEvents,
    loading,
    refetch,
  };
}

export function useCreateEvent() {
  // const userData = getCookie("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createEvent(values: Partial<Event>) {
    setLoading(true);

    try {
      const { data, error, status } = await supabase.from("events").upsert([
        {
          ...values,
        },
      ]);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        //
        router.push(` /event/${values?.eventAlias}/content/info`);
        toast.success("Event created successfully");
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

  async function update(
    values: Partial<Event>,
    eventId: string,
    message?: any
  ) {
    setLoading(true);

    try {
      const { data, error, status } = await supabase
        .from("events")
        .update([
          {
            ...values,
          },
        ])
        .eq("eventAlias", eventId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        setLoading(false);

        toast.success(message || "Event updated successfully");
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
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        setLoading(false);

        toast.success("Organization updated successfully");
      }
    } catch (error) {}
  }

  return {
    update,
    updateOrg,
    loading,
  };
}

export function usePublishEvent() {
  const [isLoading, setLoading] = useState<boolean>(false);

  const publishEvent = async ({
    payload,
    eventId,
    email,
  }: {
    payload: Partial<Event>;
    eventId: string;
    email: string;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await patchRequest<Event>({
        endpoint: `/events/${eventId}?email=${email}`,
        payload,
      });

      if (status !== 200) throw data;

      toast("Agenda Published");
      return data;
    } catch (error: any) {
      toast(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return { publishEvent, isLoading };
}

export function useFetchSingleOrganization(id?: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Organization | null>(null);

  useEffect(() => {
    fecthSingleOrg();
  }, []);

  async function fecthSingleOrg() {
    if (!id) return;
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("organization")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast.error(fetchError.message);
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
        toast.error(error.message);
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
        toast.error(fetchError.message);
        setLoading(false);
        return null;
      }
      const eventAlias = generateAlias();
      // Create a new event with the same data
      const newEvent = {
        ...originalEvent,
        eventAlias,
        eventTitle: (originalEvent.eventTitle += " (D)"),
        published: false,
      };
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
        toast.error(insertError.message);
        setLoading(false);
        return null;
      }

      if (status === 201 || status === 200) {
        toast.success("Event successfully duplicated");
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
        toast.error(error.message);
        return false;
      }

      if (status === 204 || status === 200) {
        toast.success("Event deleted successfully");
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
        toast.error(error.message);
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

export function useFetchSingleEvent(eventId: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TOrgEvent | null>(null);

  useEffect(() => {
    fetchSingleEvent();
  }, []);

  async function fetchSingleEvent() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("eventAlias", eventId)
        .maybeSingle();

      if (fetchError) {
        toast.error(fetchError.message);
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
  const {user:userData} = useUserStore()
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  async function registerAttendees(
    eventTransactionRef: string,
    values: z.infer<typeof eventBookingValidationSchema>,
    eventId?: number,
    eventAlias?: string,
    attendants?: string | null,
    paymentLink?: string
  ) {
    const { attendeeApplication } = values;

    try {
      const attendees = attendeeApplication.map((attendee) => {
        return {
          ...attendee,
          eventId,
          eventAlias,
          attendeeType: [attendants],
          registrationDate: new Date(),
          paymentLink,
          registrationCompleted: false,
          eventRegistrationRef: eventTransactionRef,
          userEmail: userData?.userEmail,
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
          // shadcnToast({variant:"destructive",description:"User has already registered for this event")
        } else {
          toast.error(error.message);
        }

        setIsRegistered(true);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        setIsRegistered(false);
        //  allowPayment(true);
        toast.success(
          "Attendees Information has been Captured. Proceed to Payment..."
        );
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
  const {user: userData} = useUserStore()
  async function sendTransactionDetail(
    allowPayment: (bool: boolean) => void,
    values: any
  ) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        userEmail: userData?.userEmail,
        userId: userData?.id,
      };

      const {
        data: successData,
        error,
        status,
      } = await supabase.from("eventTransactions").upsert([{ ...payload }]);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        allowPayment(true);
        // shadcnToast({description:"Al");
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
  const [data, setData] = useState<TEventTransactionDetail>(
    {} as TEventTransactionDetail
  );

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
        toast.error(fetchError.message);
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
  const { updateAttendees, isLoading } = useUpdateAttendees();
  const [loading, setLoading] = useState(false);

  async function sendTransactionDetail(
    toggleSuccessModal: (bool: boolean) => void,
    payload: any
  ) {
    setLoading(true);
    // eventId  eventRegistrationRef
    try {
      const { data, status } = await postRequest({
        endpoint: "/payment",
        payload,
      });

      if (status === 204 || status === 200) {
        const { data: attendees, status } = await getRequest<TAttendee[]>({
          endpoint: `/attendees/event/${payload?.eventId}`,
        });

        const registeredAttendee = attendees?.data
          ?.filter((attendee) => {
            return (
              attendee?.eventRegistrationRef === payload?.eventRegistrationRef
            );
          })
          .map((value) => {
            return {
              ...value,
              registrationCompleted: true,
            };
          });

        await updateAttendees({ payload: registeredAttendee });

        setLoading(false);
        toggleSuccessModal(true);
        toast.success("Transaction Successful");
      }
    } catch (error: any) {
      /// console.log(error)
      toast.error(
        error?.response?.data?.error ||
          "An error occurred while making the request."
      );
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

      //

      // check if code exist
      let isDiscountCodeExist = data?.map((v) => v.discountCode).includes(code);
      if (!isDiscountCodeExist) {
        toast.error("Discount code does not exist");
        setLoading(false);
        return;
      }
      // check if status is false
      let discount = data?.find((v) => v.discountCode === code);
      let isDiscountCodeValid = discount?.status;
      if (!isDiscountCodeValid) {
        toast.error("Discount code has expired");

        setLoading(false);
        return;
      }

      toast.success("Discount code has been applied successfully");

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

export function useEventFeedBack() {
  const [loading, setLoading] = useState(false);

  async function sendFeedback(values: any) {
    setLoading(true);

    try {
      const { error, status } = await supabase
        .from("zikorofeedback")
        .upsert([{ ...values }]);

      if (error) {
        toast.error(error.message);

        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast.success("Thanks... Your feedback has been recieved");
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
        toast.error(error.message);

        setLoading(false);
        return;
      }
      if (status === 201 || status === 200) {
        setLoading(false);
        toast.success("Discount created successfully");
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
        toast.error(error.message);

        setUpdating(false);
        return;
      }
      if (status === 204 || status === 200) {
        setUpdating(false);
        toast.success("Discount updated successfully");
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
        toast.error(error.message);

        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast.success("Reward created successfully");
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
        .eq("eventAlias", eventId);

      if (fetchError) {
        setLoading(false);
        return null;
      }

      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //
    }
  }

  return {
    data,
    loading,
    refetch: fetchRewards,
  };
}

export function useFormatEventData(event?: Event | null) {
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
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);

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
  const {user} = useUserStore() 
  const { attendees, isLoading: loading } = useGetAllAttendees();
  const [registeredEvents, setRegisteredEvents] = useState<Event[] | undefined>(
    []
  );

  useEffect(() => {
    if (!loading && !isLoading) {
      // console.log({attendees})
      // filter attendees based on attendees email
      const filteredAttendees = attendees?.filter(({ email }) => {
        return email === user?.userEmail;
      });
      //   console.log({filteredAttendees})
      const mappedEventId = filteredAttendees?.map((attendee) =>
        String(attendee?.eventAlias)
      );
      const filtered = events?.filter((event) => {
        // check if event ID in the attendees data and event ID in the events data correlate
        const isRegistered = mappedEventId?.includes(event?.eventAlias);

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

export function useCheckTeamMember({ eventId }: { eventId?: string }) {
  const [isIdPresent, setIsIdPresent] = useState(false);
  const { events, loading: eventLoading } = useGetUserHomePageEvents();

  useEffect(() => {
    if (events && !eventLoading) {
      //checked if the eventid is present in the event array
      const isEventIdPresent = events?.some(
        ({ eventAlias }) => eventAlias === eventId
      );

      setIsIdPresent(isEventIdPresent);
    }
  }, [events, eventLoading]);

  return {
    isIdPresent,
    eventLoading,
  };
}

export function useVerifyUserAccess(eventId: string) {
  const { attendees, isLoading } = useGetAllAttendees();
  const { attendees: eventAttendees, isLoading: loading } =
    useGetEventAttendees(eventId);
  const [attendeeId, setAttendeeId] = useState<number | undefined>();
  const [attendee, setAttendee] = useState<TAttendee | undefined>();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const {user} = useUserStore()

  useEffect(() => {
    if (!loading && !isLoading) {
      const atId = attendees?.find(
        ({ email, eventAlias }) =>
          eventAlias === eventId && email === user?.userEmail
      )?.id;
      const attendee = attendees?.find(
        ({ email, eventAlias }) =>
          eventAlias === eventId && email === user?.userEmail
      );

      setAttendeeId(atId);
      setAttendee(attendee);

      const isPresent = eventAttendees?.some(
        ({ attendeeType, id }) =>
          id === atId && attendeeType.includes("organizer")
      );
      setIsOrganizer(isPresent);
    }
  }, [attendees, eventAttendees, loading, isLoading]);

  return {
    attendeeId,
    attendee,
    isOrganizer,
    loading,
    isLoading,
  };
}
