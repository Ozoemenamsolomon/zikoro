"use client";
import { toast } from "@/components/ui/use-toast";
import { TAgenda, TSessionAgenda, TReview, TMyAgenda } from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";
import { useFetchSingleEvent } from "@/hooks";

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
      // console.log({ error });
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

export const useGetAgendas = (eventId: string) => {
  const [agendas, setAgendas] = useState<TAgenda[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getAgendas = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAgenda[]>({
      endpoint: `/agenda/${eventId}`,
    });

    setLoading(false);

    if (status !== 200) return;

    //
    return setAgendas(data.data);
  };

  useEffect(() => {
    getAgendas();
  }, []);

  return { agendas, isLoading, getAgendas };
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

  const deleteAgenda = async ({ agendaId }: { agendaId: number }) => {
    setLoading(true);

    try {
      const { data, status } = await deleteRequest<TAgenda>({
        endpoint: `/agenda/${agendaId}`,
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

export const useGetSessionAgendas = (
  eventId: string,
  date: string,
  query: string | null
) => {
  const [sessionAgendas, setSessionAgendas] = useState<TSessionAgenda[]>([]);
  const { agendas, isLoading, getAgendas } = useGetAgendas(eventId);
  const {
    myAgendas,
    isLoading: loadingMyAgenda,
    getMyAgendas,
  } = useGetMyAgendas();
  const { data, loading, refetch } = useFetchSingleEvent(eventId);
  const [fetching, setFetching] = useState(true);

  function sortAgendasByStartDateTime(agendas: TAgenda[]): TAgenda[] {
    return agendas.sort((a, b) => {
      const dateA = new Date(a.startDateTime);
      const dateB = new Date(b.startDateTime);
      return dateA.getTime() - dateB.getTime();
    });
  }

  async function refetchSession() {
    await Promise.all([getAgendas(), refetch(), getMyAgendas()]);
  }
  // get the events
  useEffect(() => {
    if (!loading && !isLoading && !loadingMyAgenda) {
      setFetching(false);

      const formattedAgendas = myAgendas?.map(({ agenda }) => {
        return {
          ...agenda,
        };
      });

      const toFilterArray = query === "my-agenda" ? formattedAgendas : agendas;

      const activeDate = date || data?.startDateTime;
      const sortedActiveDateAgendas = sortAgendasByStartDateTime(
        toFilterArray?.filter(
          ({ startDateTime }) =>
            startDateTime?.split("T")[0] === activeDate?.split("T")[0]
        )
      );

      const agendaGroups: { [key: string]: TSessionAgenda } = {};

      sortedActiveDateAgendas.forEach((agenda) => {
        const key = `${agenda.startDateTime}-${agenda.endDateTime}`;

        if (!agendaGroups[key]) {
          agendaGroups[key] = {
            timeStamp: {
              start: agenda.startDateTime,
              end: agenda.endDateTime,
            },
            sessions: [],
          };
        }

        agendaGroups[key].sessions.push(agenda);
      });

      const result = Object.values(agendaGroups);

      setSessionAgendas(result);
    }
  }, [agendas, data, loading, isLoading]);

  return {
    sessionAgendas,
    refetchSession,
    fetching,
  };
};

export const useSendReview = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const sendReview = async ({ payload }: { payload: TReview }) => {
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
      // console.log({ error });
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
      // console.log({ error });
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

export const useGetMyAgendas = () => {
  const [myAgendas, setMyAgendas] = useState<TMyAgenda[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getMyAgendas = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TMyAgenda[]>({
      endpoint: `/agenda/myagenda`,
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
