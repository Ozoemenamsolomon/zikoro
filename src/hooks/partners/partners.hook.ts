"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Event } from "@/types";
import { partnerSchema } from "@/validations";
import { uploadFile } from "@/utils";
import _ from "lodash";

const supabase = createClientComponentClient();

export function useAddPartners() {
  const [loading, setLoading] = useState(false);

  async function addPartners(values: z.infer<typeof partnerSchema>) {
    setLoading(true);

    const image = await uploadFile(values.companyLogo[0], "image");
    const video = await uploadFile(values.media[0], "video");

    const payload = {
      ...values,
      companyLogo: image,
      media: video,
    };

    try {
      const { error, status } = await supabase
        .from("eventPartners")
        .upsert([{ ...payload }]);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        toast.success("Partners created successfully");
      }
    } catch (error) {
      return;
    }
  }

  return {
    addPartners,
    loading,
  };
}

export function useFetchPartners(eventId: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("eventId", eventId);

      if (fetchError) {
        setLoading(false);
        return null;
      }

      setData(data);
    } catch (error) {
      setLoading(false);
      //  console.log(error);
    }
  }

  return {
    data,
    loading,
  };
}

export function useCreateEventIndustry() {
  const [loading, setLoading] = useState(false);

  async function createEventIndustry(
    eventData: Event | null,
    eventId: string,
    industry: {
      name: string;
      color: string;
    }
  ) {
    setLoading(true);
    let partnerIndustry = {};

    if (eventData?.partnerIndustry && eventData?.partnerIndustry !== null) {
      const isIndustryExist = eventData?.partnerIndustry
        .map(({ name }) => name)
        .includes(industry.name);
      if (isIndustryExist) {
        partnerIndustry = {
          partnerIndustry: [...eventData?.partnerIndustry],
        };
        setLoading(false);
        toast.error("Industry already exist");

        return;
      }

      partnerIndustry = {
        partnerIndustry: [...eventData?.partnerIndustry, industry],
      };
    } else {
      partnerIndustry = { partnerIndustry: [industry] };
    }

    try {
      const { data, error, status } = await supabase
        .from("events")
        .update([partnerIndustry])
        .eq("id", eventId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Industry created successfully");
        setLoading(false);
      }
    } catch (error) {
      return;
    }
  }

  return {
    createEventIndustry,
    loading,
  };
}

export function useFetchCreatedEventIndustries(eventId: string) {
  const [data, setData] = useState<Event | null>(null);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch the event by ID
      const { data, error, status } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        toast.error(error.message);

        return null;
      }

      setData(data);
    } catch (error) {
      return null;
    }
  }

  return {
    data,
    refetch: fetchData,
  };
}
