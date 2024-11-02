import { toast } from "@/components/ui/use-toast";
import { UseGetResult, usePostResult } from "@/types";
import { Contact, ContactRequest } from "@/types/contacts";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type RequestContactPayload = Pick<
  ContactRequest,
  "senderUserEmail" | "receiverUserEmail"
>;

export const useRequestContact = ({
  receiverAlias,
}: {
  receiverAlias: string;
}): usePostResult<RequestContactPayload, "requestContact"> => {
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
        endpoint: `/contacts/request?receiverAlias=${receiverAlias}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Contact Requested Successfully",
      });
      return data.data;
    } catch (error) {
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

export const useGetContactRequests = ({
  userEmail,
  eventAlias,
}: {
  userEmail?: string;
  eventAlias?: string;
}): UseGetResult<
  ContactRequest[],
  "userContactRequests",
  "getContactRequests"
> => {
  const [userContactRequests, setContactRequests] = useState<ContactRequest[]>(
    []
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getContactRequests = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<ContactRequest[]>({
        endpoint: `/contacts/request?${
          userEmail ? `&userEmail=${userEmail}` : ""
        }&${eventAlias ? `eventAlias=${eventAlias}` : ""}`,
      });

      if (status !== 200) {
        throw data;
      }
      setContactRequests(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactRequests();
  }, []);

  return {
    userContactRequests,
    isLoading,
    error,
    getContactRequests,
  };
};

type RespondToContactRequestPayload = {
  body: Pick<Contact, "userEmail" | "contactUserEmail" | "contactRequestId">;
  action: "accept" | "reject";
};

export const useRespondToContactRequest = (): usePostResult<
  RespondToContactRequestPayload,
  "respondToContactRequest"
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const respondToContactRequest = async ({
    payload,
  }: {
    payload: RespondToContactRequestPayload;
  }) => {
    setLoading(true);
    toast({
      description: `${payload.action}ing to contact request...`,
    });
    try {
      const { data, status } =
        await postRequest<RespondToContactRequestPayload>({
          endpoint: `/contacts/request/respond?action=${payload.action}`,
          payload: payload.body,
        });

      if (status !== 201) throw data.data;
      toast({
        description: `Contact ${payload.action}ed Successfully`,
      });
      return data.data;
    } catch (error) {
      setError(true);
      toast({
        description: "An error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { respondToContactRequest, isLoading, error };
};
