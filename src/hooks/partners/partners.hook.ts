"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Event, TPartner, PartnerBannerType, PartnerJobType } from "@/types";
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

export function useFetchPartners(eventId: string | number) {
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //  console.log(error);
    }
  }

  return {
    data,
    loading,
    refetch:fetchPartners
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

export function useFetchSinglePartner(partnerId: string) {
  const [data, setData] = useState<TPartner | null>(null);

  useEffect(() => {
    fetchSinglePartner();
  }, []);

  async function fetchSinglePartner() {
    try {
      // Fetch the partner by ID
      const { data, error, status } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("id", partnerId)
        .single();

      if (error) {
        toast.error(error.message);
        return null;
      }

      if (status === 200) {
        setData(data);
      }
    } catch (error) {
      return null;
    }
  }

  return {
    data,
    refetch: fetchSinglePartner,
  };
}

export function useAddPartnerBanner() {
  const [loading, setLoading] = useState(false);

  async function addPartnerBanner(
    partnerId: string,
    partnerBanners: any[],
    partner: TPartner | null
  ) {
    setLoading(true);
    try {
      const promises = partnerBanners.map(({ file, link }) => {
        return new Promise(async (resolve, reject) => {
          try {
            const imageLink = await uploadFile(file[0], "image");

            resolve({ file: imageLink, link });
          } catch (error) {
            reject(error);
          }
        });
      });

      const result = await Promise.all(promises);
      let banners = {};

      if (partner?.banners && partner?.banners !== null) {
        banners = { banners: [...partner?.banners, ...result] };
      } else {
        banners = { banners: result };
      }
      const { error, status } = await supabase
        .from("eventPartners")
        .update([banners])
        .eq("id", partnerId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Banners added successfully");
        setLoading(false);
      }
    } catch (error) {
      return;
    }
  }

  return {
    addPartnerBanner,
    loading,
  };
}

export function useAddPartnerJob() {
  const [loading, setLoading] = useState(false);

  async function addPartnerJob(
    partnerId: string,
    partnerJob: PartnerJobType,
    partner: TPartner | null
  ) {
    setLoading(true);
    try {
      let jobs = {};

      if (partner?.jobs && partner?.jobs !== null) {
        jobs = { jobs: [...partner?.jobs, partnerJob] };
      } else {
        jobs = { jobs: [partnerJob] };
      }
      const { error, status } = await supabase
        .from("eventPartners")
        .update([jobs])
        .eq("id", partnerId);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Jobs added successfully");
        setLoading(false);
      }
    } catch (error) {
      return;
    }
  }

  return {
    addPartnerJob,
    loading,
  };
}
