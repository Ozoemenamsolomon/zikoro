import { toast } from "@/components/ui/use-toast";
import { TAffiliate, TAffiliateLink, TSentEmail } from "@/types/marketing";
import { UseGetResult, usePostResult } from "@/types/request";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useSendMarketingEmail = (): usePostResult<
  TSentEmail,
  "sendMarketingEmail"
> => {
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

export const useGetAffiliates = (): UseGetResult<
  TAffiliate[],
  "affiliates",
  "getAffiliates"
> => {
  const [affiliates, setAffiliates] = useState<TAffiliate[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAffiliates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAffiliate[]>({
        endpoint: "marketing/affiliate",
      });

      if (status !== 200) {
        throw data;
      }
      setAffiliates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAffiliates();
  }, []);

  return {
    affiliates,
    isLoading,
    error,
    getAffiliates,
  };
};

export const useGetMarketingEmails = (): UseGetResult<
  TSentEmail[],
  "marketingEmails",
  "getMarketingEmails"
> => {
  const [marketingEmails, setMarketingEmails] = useState<TSentEmail[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getMarketingEmails = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TSentEmail[]>({
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

export const useCreateAffiliateLink = (): usePostResult<
  TAffiliateLink,
  "createAffiliateLink"
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAffiliateLink = async ({
    payload,
  }: {
    payload: TAffiliateLink;
  }) => {
    setLoading(true);
    toast({
      description: "sending email...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: "marketing/affiliate",
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Email sent successfully",
      });
    } catch (error) {
      setError(true);
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createAffiliateLink, isLoading, error };
};

export const useCreateAffiliate = (): usePostResult<
  TAffiliate,
  "createAffiliate"
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAffiliate = async ({ payload }: { payload: TAffiliate }) => {
    setLoading(true);
    toast({
      description: "creating affiliate...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: "marketing/affiliate",
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Affiliate created successfully",
      });
    } catch (error) {
      setError(true);
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createAffiliate, isLoading, error };
};
