"use client";

import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { TLead } from "@/types";
import { postRequest } from "@/utils/api";

export const useCreateLeads = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createLeads = async ({ payload }: { payload: Partial<TLead> }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/leads",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
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

  return { createLeads, isLoading };
};
