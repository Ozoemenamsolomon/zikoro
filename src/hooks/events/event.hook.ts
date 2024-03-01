"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation"
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  eventBookingValidationSchema,
  organizationSchema,
  newEventSchema,
} from "@/validations";
import { Event } from "@/types";
import _ from "lodash";
import { postRequest } from "@/utils";
import { getCookie } from "@/hooks";

const supabase = createClientComponentClient();
const userData = getCookie("user");

export function useCreateOrganisation() {
  const [loading, setLoading] = useState(false);

  async function organisation(values: z.infer<typeof organizationSchema>) {
    setLoading(true);

    try {
      const { error, status } = await supabase
        .from("organization")
        .upsert([{ ...values, organizationOwner: userData?.userEmail }]);

      if (error) {
        toast.error(error.message);
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

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  async function createEvent(values: z.infer<typeof newEventSchema>) {
    setLoading(true);
   

    try {
      const { data, error, status } = await supabase.from("events").upsert([
        {
          ...values,
          email: userData?.userEmail,
          createdBy: userData?.userEmail,
          published:false
        },
      ]);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    
      if (status === 201 || status === 200) {
        setLoading(false);
       
        router.push(` /events/content/${values.eventAlias}/event`)
        toast.success("Event created successfully");
      }
    } catch (error) {}
  }

  return {
    createEvent,
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
      toast.error(error.message);
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

export function useFetchSingleEvent(id: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Event | null>(null);

  useEffect(() => {
    fetchSingleEvent();
  }, []);

  async function fetchSingleEvent() {
    try {
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("events")
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
    refetch: fetchSingleEvent,
  };
}

export function useBookingEvent() {
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
          // toast.error("User has already registered for this event")
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
        toast.error(error.message);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        allowPayment(true);
        // toast.success("Al");
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
       toast.error(error.message);
       return;
      }
    */
      if (status === 204 || status === 200) {
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

      // console.log({ data });

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
