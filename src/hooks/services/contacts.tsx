import { toast } from "@/components/ui/use-toast";
import { usePostResult } from "@/types";
import { postRequest } from "@/utils/api";
import { useState } from "react";

type RequestContactPayload = Pick<
  ContactRequest,
  "senderUserId" | "receiverUserId"
>;

export const useRequestContact = (): usePostResult<
  RequestContactPayload,
  "requestContact"
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const requestContact = async ({
    payload,
  }: {
    payload: RequestContactPayload;
  }) => {
    setLoading(true);
    toast({
      description: "requesting contact...",
    });
    try {
      const { data, status } = await postRequest<RequestContactPayload>({
        endpoint: "/contacts/request",
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Contact Requested Successfully",
      });
      return data.data;
    } catch (error) {
      console.log(error);
      setError(true);
      toast({
        description: "An error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { requestContact, isLoading, error };
};
