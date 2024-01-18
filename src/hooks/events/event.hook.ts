"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  eventBookingValidationSchema,
  organizationSchema,
} from "@/validations";
import { Event } from "@/types";
import _ from "lodash";

const supabase = createClientComponentClient();

export function useCreateOrganisation() {
  const [loading, setLoading] = useState(false);

  async function organisation(values: z.infer<typeof organizationSchema>) {
    setLoading(true);

    try {
      const { data, error: err } = await supabase.auth.getUser();
      if (err) {
        toast.error(err.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        const { error, status } = await supabase
          .from("organization")
          .upsert([{ ...values, organizationOwner: data?.user?.email }]);

        if (error) {
          toast.error(error.message);
          return;
        }

        if (status === 201 || status === 200) {
          setLoading(false);
          toast.success("Organisation created successfully");
        }
      }
    } catch (error) {}
  }

  return {
    organisation,
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

export async function fetchData(): Promise<Event[] | null> {
  try {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      toast.error(error.message);

      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

export function useFetchOrganizationEvents(id?: string) {
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
      const newEvent = { ...originalEvent };
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

export async function fetchSingleEvent(id: string) {
  try {
    // Fetch the event by ID
    const { data, error: fetchError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      toast.error(fetchError.message);

      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export function useBookingEvent() {
  const [loading, setLoading] = useState(false);

  async function registerAttendees(
    allowPayment: (bool:boolean) => void,
    values: z.infer<typeof eventBookingValidationSchema>,
    eventId?: number,
    organization?: string | null,
    
  ) {
    const { others, attendeeApplication } = values;

    const socialMediaMapping: Record<string, string | any> = {
      instagram: "instagram",
      facebook: "facebook",
      whatsapp: "whatsapp",
      friends: "friends",
      others: others,
    };
    let social: Record<string, any> = {};

    if (values.aboutUs === "others") {
      social = { others: values.others };
    } else if (socialMediaMapping[values.aboutUs]) {
      social = { [values.aboutUs]: values.aboutUs };
    }

    try {
      const { data, error: err } = await supabase.auth.getUser();
      if (err) {
        toast.error(err.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        const attendees = attendeeApplication.map((attendee) => {
          return {
            ...attendee,
            eventId,
            organization,
            ...social,
            registrationDate: new Date(),
            userEmail: data?.user.email,
          };
        });

        const { error, status } = await supabase
          .from("attendees")
          .upsert([...attendees]);

        if (error) {
          toast.error(error.message);
          allowPayment(false)
          return;
        }

        if (status === 201 || status === 200) {
          setLoading(false);
          allowPayment(true)
          toast.success("Attendees Registration successful");
        }
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    registerAttendees,
    loading,
  };
}

export function useTransactionDetail() {
  const [loading, setLoading] = useState(false);
  async function sendTransactionDetail(toggleSuccessModal:(bool:boolean) => void,values: any) {

    setLoading(true)
    try {
      const { data, error: err } = await supabase.auth.getUser();
      if (err) {
        toast.error(err.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        const payload = {
          ...values,
          userEmail: data?.user?.email,
          userId: data?.user?.id,
        };

        const { error, status } = await supabase
          .from("eventTransactions")
          .upsert([{ ...payload }]);

        if (error) {
          toast.error(error.message);
          return;
        }

        if (status === 201 || status === 200) {
          setLoading(false);
          toggleSuccessModal(true)
          // toast.success("Al");
        }
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    sendTransactionDetail,
    loading
  };
}
