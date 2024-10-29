"use client";
import { toast } from "@/components/ui/use-toast";
import {
  TAgenda,
  TSessionAgenda,
  TReview,
  TMyAgenda,
  UseGetResult,
  TFeedBack,
} from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateAgenda = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createAgenda = async ({ payload }: { payload: Partial<TAgenda> }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/agenda",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
        });

      toast({
        description: "Agenda created successfully",
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
  };

  return { createAgenda, isLoading };
};

export const useUpdateAgenda = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const updateAgenda = async ({ payload }: { payload: Partial<TAgenda> }) => {
    setLoading(true);

    try {
      const { data, status } = await patchRequest<TAgenda>({
        endpoint: "/agenda",
        payload,
      });

      if (status !== 200) throw data;

      toast({
        description: "Agenda Updated successfully",
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
  };

  return { updateAgenda, isLoading };
};

export const useGetAgendas = (
  eventId: string,
  date?: string,
  query?: string | null
) => {
  const [agendas, setAgendas] = useState<TSessionAgenda[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // console.log({date})
  const getAgendas = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TSessionAgenda[]>({
      endpoint: `/agenda/${eventId}?${date ? "date=" + date : ""}&${
        query ? "query=" + query : ""
      }`,
    });

    setLoading(false);

    if (status !== 200) return;

    //
    return setAgendas(data.data);
  };

  useEffect(() => {
    getAgendas();
  }, [eventId, date, query]);

  return { agendas, isLoading, getAgendas };
};

export const useGetEventAgendas = ({
  eventId,
  isAlias = false,
}: {
  eventId: string;
  isAlias: boolean;
}): UseGetResult<TAgenda[], "eventAgendas", "getEventAgendas"> => {
  const [eventAgendas, setEventAgendas] = useState<TAgenda[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEventAgendas = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAgenda[]>({
        endpoint: `events/${eventId}/agendas?isAlias=${isAlias ? "1" : "0"}`,
      });

      if (status !== 200) {
        throw data;
      }

      setEventAgendas(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventAgendas();
  }, []);

  return {
    eventAgendas,
    isLoading,
    error,
    getEventAgendas,
  };
};

export const useGetAgenda = ({ agendaId }: { agendaId: string }) => {
  const [agenda, setAgenda] = useState<TAgenda | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getAgenda = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TAgenda>({
        endpoint: `/agenda/single/${agendaId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setAgenda(data.data);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgenda();
  }, [agendaId]);

  return { agenda, isLoading, getAgenda };
};

export const useDeleteAgenda = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const deleteAgenda = async ({ agendaId }: { agendaId: string }) => {
    setLoading(true);

    try {
      const { data, status } = await deleteRequest<TAgenda>({
        endpoint: `/agenda/delete/${agendaId}`,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Agenda deleted successfully",
      });

      return data.data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { deleteAgenda, isLoading };
};

export const useSendReview = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const sendReview = async ({ payload }: { payload: Partial<TReview> }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/agenda/review",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
        });

      toast({
        description: "Review Sent successfully",
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
  };

  return { sendReview, isLoading };
};

interface TCalculatedReview {
  average: number;
  rating: number;
  review: TFeedBack[];
}
export const useGetReviews = () => {
  const [rating, setRating] = useState<TCalculatedReview | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getRating = async ({ agendaId }: { agendaId: string }) => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TCalculatedReview>({
        endpoint: `/agenda/review/${agendaId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setRating(data.data);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { rating, isLoading, getRating };
};

export const useGetEventReviews = (eventId?: string) => {
  const [reviews, setReviews] = useState<TFeedBack[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getRating();
  }, [eventId]);
  const getRating = async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      const { data, status } = await getRequest<TFeedBack[]>({
        endpoint: `/agenda/review/event/${eventId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setReviews(data.data);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { reviews, isLoading, getRating };
};
export const useCreateMyAgenda = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createMyAgenda = async ({
    payload,
  }: {
    payload: Partial<TMyAgenda>;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/agenda/myagenda",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
        });

      toast({
        description: "Agenda added successfully",
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
  };

  return { createMyAgenda, isLoading };
};

export const useGetMyAgendas = ({ eventId }: { eventId: string }) => {
  const [myAgendas, setMyAgendas] = useState<TMyAgenda[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getMyAgendas = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TMyAgenda[]>({
      endpoint: `/agenda/myagenda/${eventId}`,
    });

    setLoading(false);

    if (status !== 200) return;

    //
    return setMyAgendas(data.data);
  };

  useEffect(() => {
    getMyAgendas();
  }, []);

  return { myAgendas, isLoading, getMyAgendas };
};
