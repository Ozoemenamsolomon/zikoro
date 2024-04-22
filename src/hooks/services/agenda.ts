"use client";
import { toast } from "@/components/ui/use-toast";
import { TAgenda } from "@/types";
import {
  postRequest,
  patchRequest,
  deleteRequest,
  getRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateAgenda = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createAgenda = async ({ payload }: { payload: TAgenda }) => {
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

export const useGetAgendas = () => {
  const [agendas, setAgendas] = useState<TAgenda[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getAgendas = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAgenda[]>({
      endpoint: `/agenda`,
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
        endpoint: `/agenda/${agendaId}`,
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
