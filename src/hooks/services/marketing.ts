import { toast } from "@/components/ui/use-toast";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

type useSendMarketingEmailResult = {
  sendMarketingEmail: ({ payload }: { payload: TSentEmail }) => Promise<void>;
} & RequestStatus;

export const useSendMarketingEmail = (): useSendMarketingEmailResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const sendMarketingEmail = async ({ payload }: { payload: TSentEmail }) => {
    setLoading(true);
    toast({
      description: "sending email...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: "marketing/email",
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Email sent successfully",
      });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { sendMarketingEmail, isLoading, error };
};

type UseGetMarketingEmailsResult = {
  marketingEmails: TSentEmail[];
  getMarketingEmails: () => Promise<void>;
} & RequestStatus;

export const useGetMarketingEmails = (): UseGetMarketingEmailsResult => {
  const [marketingEmails, setMarketingEmails] = useState<TSentEmail[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getMarketingEmails = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TSentEmail>({
        endpoint: "marketing/email",
      });

      if (status !== 200) {
        throw data;
      }
      setMarketingEmails(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMarketingEmails();
  }, []);

  return {
    marketingEmails,
    isLoading,
    error,
    getMarketingEmails,
  };
};
