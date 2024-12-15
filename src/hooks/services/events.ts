"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { eventBookingValidationSchema, organizationSchema } from "@/schemas";
import {
  Event,
  Organization,
  RedeemPoint,
  TAttendee,
  TEventDiscount,
  TEventTransactionDetail,
  TOrgEvent,
} from "@/types";
import _ from "lodash";
import { useUpdateAttendees } from "@/hooks";
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
import useAccessStore from "@/store/globalAcessStore";
import { generateAlphanumericHash } from "@/utils/helpers";
import { Reward } from "@/types";
import { useGetData } from "@/hooks/services/request";
import useOrganizationStore from "@/store/globalOrganizationStore";

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
        endpoint: `/events?${userId ? "userId=" + userId + "&" : ""}${
          organisationId ? "organisationId=" + organisationId : ""
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

export const useGetCreatedEvents = (): UseGetResult<
  TOrgEvent[],
  "events",
  "getCreatedEvents"
> => {
  const [events, setEvents] = useState<TOrgEvent[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { user } = useUserStore();

  const getCreatedEvents = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrgEvent[]>({
        endpoint: `/events/created/${user?.id}`,
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
    getCreatedEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    getCreatedEvents,
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
  const { user: userData } = useUserStore();
  const [loading, setLoading] = useState(false);

  async function organisation(
    values: Partial<z.infer<typeof organizationSchema>>, exp?:string
  ) {
    setLoading(true);
    const { firstName, lastName, userEmail, ...restData } = values;
    try {
      const { error, status } = await supabase.from("organization").upsert([
        {
          ...restData,
          organizationOwner: userData?.userEmail,
          organizationOwnerId: userData?.id,
          subscriptionExpiryDate: exp || null,
          teamMembers: [
            {
              userId: userData?.id,
              userFirstName: userData?.firstName,
              userLastName: userData?.lastName,
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
  const { user: userData } = useUserStore();
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
  const { setOrganization } = useOrganizationStore();

  async function refetch() {
    getEvents();
    getOrganizations();
  }
  useEffect(() => {
    if (!isLoading && !orgLoading && events && organizations) {
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

      const chosenOrganization = organizations?.find(
        (v) => v?.id === Number(organizationIds[0])
      );
      setOrganization(chosenOrganization || null);

      setFirstSetEvents(firstSet);

      setUserEvents(matchingEvents);
      setLoading(false);
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

      toast("Event Published");
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
  const [data, setData] = useState<TOrgEvent[]>([]);

  useEffect(() => {
    if (id) fetchOrganizationEvents();
  }, [id]);

  async function fetchOrganizationEvents() {
    setLoading(true);
    try {
      const { data: eventData, error } = await supabase
        .from("events")
        .select("*, organization!inner(*)")
        .eq("organisationId", id)
        .range(0, 1000);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (eventData) {
        const eventsWithAttendees = await Promise.all(
          eventData.map(async (event) => {
            const { data: fetchedAttendees, error: errorFetchingAttendee } =
              await supabase
                .from("attendees")
                .select("*")
                .eq("eventAlias", event?.eventAlias);

            if (errorFetchingAttendee) {
              console.error(
                `Failed to fetch attendees for event ${event.eventAlias}: ${errorFetchingAttendee.message}`
              );
              return { ...event, attendees: [] };
            }

            return { ...event, attendees: fetchedAttendees };
          })
        );

        setData(eventsWithAttendees);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred while fetching events.");
    } finally {
      setLoading(false);
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
      // const { data, error: fetchError } = await supabase
      //   .from("events")
      //   .select("*, organization!inner(*)")
      //   .eq("eventAlias", eventId)
      //   .maybeSingle();
      const { data, status } = await getRequest<TOrgEvent>({
        endpoint: `events/${eventId}/event`,
      });
      if (status !== 200) {
        return;
      }

      setData(data.data);
    } catch (error) {
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    refetch: fetchSingleEvent,
  };
}

export function useBookingEvent() {
  const { user: userData } = useUserStore();
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

      setLoading(true);
      const { error, status } = await supabase
        .from("attendees")
        .upsert([...attendees]);
      if (error) {
        if (
          error.message ===
          `duplicate key value violates unique constraint "attendees_email_key"`
        ) {
          toast.error(
            "You have already registered for this event. Kindly check your mail to continue."
          );
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
    } finally {
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
  const { user: userData } = useUserStore();
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
        // const { data: attendees, status } = await getRequest<TAttendee[]>({
        //   endpoint: `/attendees/event/${payload?.eventAlias}`,
        // });

        // const registeredAttendee = attendees?.data
        //   ?.filter((attendee) => {
        //     return (
        //       attendee?.eventRegistrationRef === payload?.eventRegistrationRef
        //     );
        //   })
        //   .map((value) => {
        //     return {
        //       ...value,
        //       registrationCompleted: true,
        //       attendeeType: payload.role ?? ["attendee"],
        //     };
        //   });

        // await updateAttendees({ payload: registeredAttendee });

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
  const [discountAmount, setDiscountAmount] = useState<
    number | null | undefined
  >(null);
  const [discountPercentage, setDiscountPercentage] = useState<
    number | null | undefined
  >(null);
  const [minAttendees, setMinAttendees] = useState<number | undefined>();

  async function verifyDiscountCode(code: string | undefined, eventId: string) {
    setLoading(true);
    try {
      const { data, status } = await getRequest<TEventDiscount[]>({
        endpoint: `/events/${eventId}/discount/event`,
      });

      if (status !== 200) {
        throw data;
      }

      //

      // check if code exist
      let isDiscountCodeExist = data?.data
        ?.map((v) => v.discountCode)
        .includes(code!);
      if (!isDiscountCodeExist) {
        toast.error("Discount code does not exist");
        setLoading(false);
        return;
      }
      // check if status is false
      let discount = data?.data?.find((v) => v.discountCode === code);
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
    } finally {
      setLoading(false);
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

  async function createReward(payload: Partial<Reward>) {
    setLoading(true);

    try {
      const { data, status } = await postRequest<Partial<Reward>>({
        endpoint: "/rewards",
        payload,
      });

      toast.success("Rewards created successfully");
      return data;
    } catch (error: any) {
      //
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  return {
    createReward,
    loading,
  };
}

export function useUpdateReward() {
  const [loading, setLoading] = useState(false);

  async function updateReward(payload: Partial<Reward>) {
    setLoading(true);
    try {
      const { data, status } = await patchRequest<Partial<Reward>>({
        endpoint: "/rewards",
        payload,
      });

      toast.success("Rewards Updated successfully");
      return data;
    } catch (error: any) {
      //
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  return {
    updateReward,
    loading,
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
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[] | undefined>(
    []
  );
  // events/attendee/${email}
  const getAttendeeRecord = async () => {
    if (user) {
      try {
        setLoading(true);
        const { data, status } = await getRequest<TAttendee[]>({
          endpoint: `/events/attendee/${user?.userEmail}`,
        });
        setAttendees(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAttendeeRecord();
  }, [user]);
  useEffect(() => {
    if (!loading && !isLoading) {
      //   console.log({filteredAttendees})
      const mappedEventId = attendees?.map((attendee) =>
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

export function useCheckTeam({ eventId }: { eventId: string }) {
  const { user } = useUserStore();
  const { organization } = useOrganizationStore();

  const isIdPresent =
    organization?.teamMembers?.some((v) => v?.userEmail === user?.userEmail) ||
    false;

  return {
    isIdPresent,
  };
}
export function useCheckTeamMember({ eventId }: { eventId?: string }) {
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const [isIdPresent, setIsIdPresent] = useState(false);

  async function fetchSingleEvent() {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TOrgEvent>({
        endpoint: `events/${eventId}/event`,
      });

      const eventOrganization = data?.data?.organization;

      const isMember = eventOrganization.teamMembers.some(
        (v) => v.userEmail === user?.userEmail
      );
      setIsIdPresent(isMember);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSingleEvent();
  }, [eventId, user]);

  return {
    verifyTeamMember: loading,
    isIdPresent,
  };
}

export function useVerifyUserAccess(eventId: string) {
  const { attendees: eventAttendees, isLoading: loading } =
    useGetEventAttendees(eventId);
  const [attendeeId, setAttendeeId] = useState<number | undefined>();
  const [attendee, setAttendee] = useState<TAttendee | undefined>();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const atId = eventAttendees?.find(
        ({ email, eventAlias }) =>
          eventAlias === eventId && email === user?.userEmail
      )?.id;
      const attendee = eventAttendees?.find(
        ({ email, eventAlias, archive }) =>
          eventAlias === eventId && email === user?.userEmail && !archive
      );

      setAttendeeId(atId);
      setAttendee(attendee);

      const isPresent = eventAttendees?.some(
        ({ attendeeType, id }) =>
          id === atId && attendeeType.includes("organizer")
      );
      setIsOrganizer(isPresent);
      // setUserAccess({
      //   ...userAccess,
      //   isOrganizer: isPresent,
      //   attendeeId: atId,
      //   attendee,
      // });
      setIsLoading(false);
      // console.log("attendee", isPresent);
    }
  }, [eventAttendees, loading,  user]);

  return {
    attendeeId,
    attendee,
    isOrganizer,
    loading,
    isLoading,
    eventAttendees,
  };
}

type TBoardData = { [key: string]: any[] };

export function useGetUserPoint(eventId: string) {
  const { attendeeId } = useVerifyUserAccess(eventId);
  const [totalPoints, setTotalPoints] = useState(0);
  const { data, isLoading } = useGetData<TBoardData>(
    `/engagements/${eventId}/leaderboard`
  );

  useEffect(() => {
    if (!isLoading && data && attendeeId) {
      let total = 0;
      Object.entries(data)?.forEach(([key, value]) => {
        const sum = value
          ?.filter((item) => Number(item?.id) === attendeeId)
          ?.reduce((acc, val) => acc + (val?.points || 0), 0);

        total += sum;

        setTotalPoints(totalPoints + sum);
      });
      console.log("um", total);
      setTotalPoints(total);
    }
    // console.log("um", totalPoints);
  }, [isLoading, data, attendeeId]);

  return {
    totalPoints,
  };
}

export function useRedeemReward() {
  const [loading, setLoading] = useState(false);

  async function redeemAReward(values: Partial<RedeemPoint>) {
    setLoading(true);

    const payload = {
      ...values,
    };

    try {
      const { data, status } = await postRequest<Partial<RedeemPoint>>({
        endpoint: `/rewards/${values?.eventAlias}/redeemed`,
        payload,
      });

      toast.success("Reward redeemed successfully");
      return data;
    } catch (error: any) {
      //
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  return {
    redeemAReward,
    loading,
  };
}

export function useRedeemPartnerDiscountCode() {
  const [loading, setLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<
    number | null | undefined
  >(null);
  const [discountPercentage, setDiscountPercentage] = useState<
    number | null | undefined
  >(null);
  const [minAttendees, setMinAttendees] = useState<number | undefined>();

  async function verifyDiscountCode(code: string | undefined, eventId: string) {
    setLoading(true);
    try {
      const { data, status } = await getRequest<TEventDiscount[]>({
        endpoint: `/events/${eventId}/discount/partner`,
      });

      if (status !== 200) {
        throw data;
      }

      //

      // check if code exist
      let isDiscountCodeExist = data?.data
        ?.map((v) => v.discountCode)
        .includes(code!);
      if (!isDiscountCodeExist) {
        toast.error("Discount code does not exist");
        setLoading(false);
        return;
      }
      // check if status is false
      let discount = data?.data?.find((v) => v.discountCode === code);
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
    } finally {
      setLoading(false);
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

export const useGetAdminEvents = ({
  eventStatus,
  from,
  to,
  initialLoading,
}: {
  eventStatus: string;
  from: number;
  to: number;
  initialLoading: boolean;
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [hasReachedLastPage, setHasReachedLastPage] = useState(false);

  const getEvents = async () => {
    if (initialLoading) setLoading(true);

    try {
      const { data, status } = await getRequest<Event[]>({
        endpoint: `/events/admin/${eventStatus}?from=${from}&to=${to}`,
      });

      if (status !== 200) {
        throw data;
      }
      if (
        data.data === null ||
        (Array.isArray(data.data) && data.data.length === 0)
      )
        return setHasReachedLastPage(true);
      setEvents((prev) => _.uniqBy([...prev, ...data.data], "id"));
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEvents([]);
  }, [eventStatus]);

  useEffect(() => {
    getEvents();
  }, [eventStatus, from, to]);

  return {
    events,
    isLoading,
    error,
    getEvents,
    hasReachedLastPage,
  };
};

interface Transactions extends TEventTransactionDetail {
  eventData: TOrgEvent;
}

interface TAllResponse {
  transactions: Transactions[];
  totalPages: number;
}

export const useGetAdminEventTransactions = ({
  eventAlias,
  from,
  to,
}: {
  eventAlias: string | null;
  from: number;
  to: number;
}) => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [total, setTotal] = useState(1);
  const [hasReachedLastPage, setHasReachedLastPage] = useState(false);

  const getTransactions = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAllResponse>({
        endpoint: `/events/admin/attendees?from=${from}&to=${to}&eventAlias=${
          eventAlias ?? ""
        }`,
      });

      if (status !== 200) {
        throw data;
      }
      if (
        data.data.transactions === null ||
        (Array.isArray(data.data.transactions) &&
          data.data.transactions.length === 0)
      )
        return setHasReachedLastPage(true);
      setTransactions(_.uniqBy([...data.data.transactions], "id"));
      setTotal(data?.data?.totalPages);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTransactions([]);
  }, [eventAlias]);

  useEffect(() => {
    getTransactions();
  }, [eventAlias, from, to]);

  return {
    transactions,
    isLoading,
    error,
    getTransactions,
    hasReachedLastPage,
    total,
  };
};

export function useRequestAccess() {
  const [isLoading, setLoading] = useState<boolean>(false);

  const requestEmail = async ({
    email,
    paymentLink,
    eventTitle,
    attendeeName,
  }: {
    email: string;
    paymentLink: string;
    eventTitle: string;
    attendeeName: string;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest<any>({
        endpoint: `/request/access`,
        payload: { email, paymentLink, eventTitle, attendeeName },
      });
    } catch (error: any) {
      toast(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return { requestEmail, isLoading };
}
