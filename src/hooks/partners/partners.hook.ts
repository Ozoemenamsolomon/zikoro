"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Event, TPartner, PartnerJobType} from "@/types";
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
    refetch: fetchPartners,
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

export function useAddPartnerPromo() {
  const [loading, setLoading] = useState(false);

  async function addPromo(
    partnerId: string,
    promo: any,
    partner: TPartner | null
  ) {
    setLoading(true);
    try {
      let offers = {};

      const { productImage, ...restData } = promo;
      const image = await uploadFile(productImage[0], "image");
      const payload = {
        ...restData,
        productImage: image,
      };

      if (partner?.offers && partner?.offers !== null) {
        offers = {
          offers: [...partner?.offers, payload],
        };
      } else {
        offers = { offers: [payload] };
      }
      const { error, status } = await supabase
        .from("eventPartners")
        .update([offers])
        .eq("id", partnerId);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Offer added successfully");
        setLoading(false);
      }
    } catch (error) {
      return;
    }
  }

  return {
    addPromo,
    loading,
  };
}
export function useCreateEventExhibitionHall() {
  const [loading, setLoading] = useState(false);

  async function createExhibitionHall(
    eventId: string,
    payload: { name: string; capacity: string }
  ) {
    setLoading(true);

    try {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      const { exhibitionHall: hall, ...restData } = data;

      // initialize an empty array
      let exhibitionHall = [];

      // when there is no ex. hall
      if (hall === null) {
        exhibitionHall = [payload];
      } else {
        // when there is/are ex. hall
        exhibitionHall = [...hall, payload];
      }

      const { error, status } = await supabase
        .from("events")
        .update({ ...restData, exhibitionHall })
        .eq("id", eventId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Exhibition Hall created successfully");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    createExhibitionHall,
    loading,
  };
}

export function useUpdateBooth() {
  async function updateBooth(partnerId: string, value: string) {
    try {
      // Fetch the partner by ID
      const { data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("id", partnerId)
        .single();

      const { boothNumber, ...restData } = data;

      let booths = [];

      if (boothNumber === null) {
        booths = [value];
      } else {
        booths = [...boothNumber, value];
      }

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, boothNumber: booths })
        .eq("id", partnerId);

      if (status === 204 || status === 200) {
        //
        toast.success("Booth Number Updated");
      }
    } catch (error) {}
  }

  return {
    updateBooth,
  };
}

export function useUpdateHall() {
  async function updateHall(partnerId: string, value: string) {
    try {
      // Fetch the partner by ID
      const { data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("id", partnerId)
        .single();

      const { exhibitionHall, ...restData } = data;

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, exhibitionHall: value })
        .eq("id", partnerId);

      if (status === 204 || status === 200) {
        //
        toast.success("Exhibition Hall Updated");
      }
    } catch (error) {}
  }

  return {
    updateHall,
  };
}

export function useUpdatePartnerType() {
  async function updatePartnerType(partnerId: string, value: string) {
    try {
      // Fetch the partner by ID
      const { data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("id", partnerId)
        .single();

      const { partnerType, ...restData } = data;

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, partnerType: value })
        .eq("id", partnerId);

      if (status === 204 || status === 200) {
        //
        toast.success("Partner Type Updated");
      }
    } catch (error) {}
  }

  return {
    updatePartnerType,
  };
}

export function useUpdateSponsor() {
  async function updateSponsorCategory(partnerId: string, value: string) {
    try {
      // Fetch the partner by ID
      const { data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("id", partnerId)
        .single();

      const { sponsorCategory, ...restData } = data;

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, sponsorCategory: value })
        .eq("id", partnerId);

      if (status === 204 || status === 200) {
        //
        toast.success("Sponsor Category Updated");
      }
    } catch (error) {}
  }

  return {
    updateSponsorCategory,
  };
}

export function useFetchPartnersJob(eventId: string | number) {
  const { data, loading } = useFetchPartners(eventId);

  let allPartnersJob: any[] = [];

  data.map((item) => {
    const { jobs } = item;

    if (jobs !== null && Array.isArray(jobs)) {
      jobs.map((job) => {
        allPartnersJob.push(job);
      });
    }
  });

  return {
    jobs: allPartnersJob,
    loading,
  };
}

export function useFetchPartnersOffers(eventId: string | number) {
  const { data, loading } = useFetchPartners(eventId);

  let allPartnersOffers: any[] = [];

  data.map((item) => {
    const { offers } = item;

    if (offers !== null && Array.isArray(offers)) {
      offers.map((offer) => {
        allPartnersOffers.push(offer);
      });
    }
  });

  return {
    offers: allPartnersOffers,
    loading,
  };
}

export function useDeletePartner() {
  const [loading, setLoading] = useState(false);

  async function deletes(ids: number[]) {
    setLoading(true);
    const { error, status } = await supabase
      .from("eventPartners")
      .delete()
      .in("id", ids);

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (status === 204) {
      toast.success("Partner deleted successfully");
      setLoading(false);
      return;
    }
  }

  async function deleteAll() {
    setLoading(true);
    const { error, status } = await supabase.from("eventPartners").delete();

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (status === 204) {
      toast.success("Partners deleted successfully");
      setLoading(false);
      return;
    }
  }

  return {
    deletes,
    deleteAll,
    loading,
  };
}

export function useDeleteEventExhibitionHall(eventId: string) {
  const [loading, setLoading] = useState(false);

  async function deleteExhibitionHall(selectedRows: string[]) {
    setLoading(true);

    try {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      const { exhibitionHall: hall, ...restData } = data;
      // filter out the halls given their names
      const filteredHall = hall?.filter(
        (item: any) => !selectedRows.includes(item?.name)
      );

      const { error, status } = await supabase
        .from("events")
        .update({ ...restData, exhibitionHall: filteredHall })
        .eq("id", eventId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Exhibition Hall deleted successfully");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  async function deleteAll() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      const { exhibitionHall: hall, ...restData } = data;

      const { error, status } = await supabase
        .from("events")
        .update({ ...restData, exhibitionHall: [] })
        .eq("id", eventId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Exhibition Hall deleted successfully");
        setLoading(false);
      }
    } catch (error) {}
  }

  return {
    deleteExhibitionHall,
    loading,
    deleteAll,
  };
}

export function useAddSponsorsType() {
  const [loading, setLoading] = useState(false);

  async function addSponsors(
    levelData: { type: string; id: string }[] | undefined,
    close: () => void,
    eventId: string,
    payload: { id: string; type: string }
  ) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      const { sponsorCategory: type, ...restData } = data;

      // initialize an empty array
      let sponsorCategory: { type: string; id: string }[] = [];

      if (data) {
        const isLevelExist = levelData
          ?.map(({ type }) => type)
          .includes(payload.type);

        if (isLevelExist && levelData) {
          toast.error("Sponsor Level already exist");

          sponsorCategory = [...levelData];

          return;
        }

        // when there is no ex. hall
        if (type === null) {
          sponsorCategory = [payload];
        } else {
          // when there is/are  sponsor
          sponsorCategory = [...type, payload];
        }
      }

      const { error, status } = await supabase
        .from("events")
        .update({ ...restData, sponsorCategory })
        .eq("id", eventId);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast.success("Sponsor Type created successfully");
        // close();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    addSponsors,
    loading,
  };
}
