"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Event,
  TPartner,
  PartnerJobType,
  TExPartner,
  PromotionalOfferType,
} from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { uploadFile } from "@/utils";
import _ from "lodash";
import { toast } from "@/components/ui/use-toast";

const supabase = createClientComponentClient();

type TEventData = {
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  location: string;
  eventPoster: string;
  address: string;
  organizerName: string;
  currency: string;
  organizerPhoneNumber: string;
  organizerWhatsappNumber: string;
};
export function useAddPartners() {
  const [loading, setLoading] = useState(false);

  async function addPartners(values: Partial<TPartner>, event: TEventData) {
    setLoading(true);

    const payload = {
      values,
      event,
    };

    try {
      const { data, status } = await postRequest<Partial<TPartner>>({
        endpoint: "/partner",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
        });

      toast({
        description: "Partner created successfully",
      });
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    addPartners,
    loading,
  };
}

export function useFetchPartners(eventId: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TPartner[]>([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setLoading(true);

    try {
      const { data: result, status } = await getRequest<TPartner[]>({
        endpoint: `/partner/${eventId}`,
      });

      setLoading(false);

      if (status !== 200) return;

      return setData(result.data);
    } catch (error) {
      setLoading(false);
      //
    }
  }

  return {
    data,
    loading,
    refetch: fetchPartners,
  };
}

export function useUpdatePartners() {
  const [loading, setLoading] = useState(false);

  async function update(
    payload: Partial<TPartner>,
    deactivate?: { reason: string }
  ) {
    try {
    
      let payloadData = deactivate ? { payload, deactivate } : {payload};
      const { data, status } = await patchRequest<TPartner>({
        endpoint: "/partner",
        payload: payloadData,
      });

      if (status !== 200) throw data;

      toast({
        description: "Partner Updated successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    update,
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
        toast({
          variant: "destructive",
          description: "Industry already exist",
        });

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
        .eq("eventAlias", eventId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Industry created successfully" });
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
        .eq("eventAlias", eventId)
        .single();

      if (error) {
        toast({ variant: "destructive", description: error.message });

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSinglePartner();
  }, []);

  async function fetchSinglePartner() {
    setLoading(true);
    try {
      // Fetch the partner by ID
      const { data, error, status } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("partnerAlias", partnerId)
        .single();

      if (error) {
        toast({ variant: "destructive", description: error.message });
        return null;
      }

      if (status === 200) {
        setData(data);
      }
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    refetch: fetchSinglePartner,
    loading,
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
        .eq("partnerAlias", partnerId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Banners added successfully" });
        setLoading(false);
      }
    } catch (error) {
      return;
    }
  }
  // variant:"destructive"
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
        .eq("partnerAlias", partnerId);
      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Jobs added successfully" });
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
        .eq("partnerAlias", partnerId);
      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Offer added successfully" });
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
        .eq("eventAlias", eventId)
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
        .eq("eventAlias", eventId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Exhibition Hall created successfully" });
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
  async function updateBooth(partnerId: string, value: string[] | null) {
    try {
      // Fetch the partner by ID
      const { data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("partnerAlias", partnerId)
        .single();

      const { boothNumber, ...restData } = data;

      let booths: string[] | null = [];

      if (boothNumber === null && value) {
        booths = value;
      } else if (boothNumber && value === null) {
        booths = null;
      } else if (value) {
        booths = [...boothNumber, ...value];
      }

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, boothNumber: booths })
        .eq("partnerAlias", partnerId);

      if (status === 204 || status === 200) {
        //
        if (value !== null) toast({ description: "Booth Number Updated" });
      }
    } catch (error) {}
  }

  return {
    updateBooth,
  };
}

export function useUpdateHall() {
  async function updateHall(partnerId: string, value: string | null) {
    try {
      // Fetch the partner by ID
      const { data } = await supabase
        .from("eventPartners")
        .select("*")
        .eq("partnerAlias", partnerId)
        .single();

      const { exhibitionHall, ...restData } = data;

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, exhibitionHall: value })
        .eq("partnerAlias", partnerId);

      if (status === 204 || status === 200) {
        //
        if (value !== null) toast({ description: "Exhibition Hall Updated" });
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
        .eq("partnerAlias", partnerId)
        .single();

      const { partnerType, ...restData } = data;

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, partnerType: value })
        .eq("partnerAlias", partnerId);

      if (status === 204 || status === 200) {
        //
        toast({ description: "Partner Type Updated" });
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
        .eq("partnerAlias", partnerId)
        .single();

      const { sponsorCategory, ...restData } = data;

      const { error, status } = await supabase
        .from("eventPartners")
        .update({ ...restData, sponsorCategory: value })
        .eq("partnerAlias", partnerId);

      if (status === 204 || status === 200) {
        //
        toast({ description: "Sponsor Category Updated" });
      }
    } catch (error) {}
  }

  return {
    updateSponsorCategory,
  };
}

export function useFetchPartnersJob(eventId: string) {
  const { data, loading, refetch } = useFetchPartners(eventId);

  let allPartnersJob: PartnerJobType[] = [];

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
    refetch,
  };
}

export function useFetchPartnersOffers(eventId: string) {
  const { data, loading, refetch } = useFetchPartners(eventId);

  let allPartnersOffers: PromotionalOfferType[] = [];

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
    refetch,
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
      toast({ variant: "destructive", description: error.message });
      return;
    }

    if (status === 204) {
      toast({ description: "Partner deleted successfully" });
      setLoading(false);
      return;
    }
  }

  async function deleteAll() {
    setLoading(true);
    const { error, status } = await supabase.from("eventPartners").delete();

    if (error) {
      setLoading(false);
      toast({ variant: "destructive", description: error.message });
      return;
    }

    if (status === 204) {
      toast({ description: "Partners deleted successfully" });
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
        .eq("eventAlias", eventId)
        .single();

      const { exhibitionHall: hall, ...restData } = data;
      // filter out the halls given their names
      const filteredHall = hall?.filter(
        (item: any) => !selectedRows.includes(item?.name)
      );

      const { error, status } = await supabase
        .from("events")
        .update({ ...restData, exhibitionHall: filteredHall })
        .eq("eventAlias", eventId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Exhibition Hall deleted successfully" });
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
        .eq("eventAlias", eventId)
        .single();

      const { exhibitionHall: hall, ...restData } = data;

      const { error, status } = await supabase
        .from("events")
        .update({ ...restData, exhibitionHall: [] })
        .eq("eventAlias", eventId);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 204 || status === 200) {
        //
        toast({ description: "Exhibition Hall deleted successfully" });
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

export function useUpdatePartnersOpportunities<T>() {
  const [loading, setLoading] = useState(false);

  async function update(payload: Partial<T>, type: string) {
    try {
      const { data, status } = await patchRequest<T>({
        endpoint: `/partner/opportunities?type=${type}`,
        payload,
      });

      if (status !== 201) throw data;

      toast({
        description: "Partner Updated successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    update,
    loading,
  };
}

export function useDeletePartnersOpportunities<T>() {
  const [loading, setLoading] = useState(false);

  async function deletes(id: string, type: string) {
    try {
      const { data, status } = await deleteRequest<T>({
        endpoint: `/partner/opportunities?type=${type}&id=${id}`,
      });

      //  if ( status !== 201) throw data;

      toast({
        description: "Partner Updated successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    deletes,
    loading,
  };
}
