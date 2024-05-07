import { toast } from "@/components/ui/use-toast";
import { UseGetResult, usePostResult } from "@/types";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type RequestContactPayload = Pick<
  ContactRequest,
  "senderUserEmail" | "receiverUserEmail"
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

export const useGetUserContactRequests = ({
  userEmail,
}: {
  userEmail: string;
}): UseGetResult<
  ContactRequest[],
  "userContactRequests",
  "getUserContactRequests"
> => {
  const [userContactRequests, setUserContactRequests] = useState<
    ContactRequest[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getUserContactRequests = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<ContactRequest[]>({
        endpoint: `/contacts/request?userEmail=${userEmail}`,
      });

      if (status !== 200) {
        throw data;
      }
      setUserContactRequests(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserContactRequests();
  }, []);

  return {
    userContactRequests,
    isLoading,
    error,
    getUserContactRequests,
  };
};
