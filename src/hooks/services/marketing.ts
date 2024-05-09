"use client";

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
    console.log(payload, "data");
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

export const useGetAffiliates = ({
  eventId,
}: {
  eventId: string;
}): UseGetResult<TAffiliate[], "affiliates", "getAffiliates"> => {
  const [affiliates, setAffiliates] = useState<TAffiliate[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAffiliates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAffiliate[]>({
        endpoint: `marketing/affiliate?eventId=${eventId}`,
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

interface AffiliateLinkInfo {
  payload: TAffiliateLink;
  organizationName: string;
  affiliateName: string;
  eventPoster: string;
}

export const useCreateAffiliateLink = (): usePostResult<
  AffiliateLinkInfo,
  "createAffiliateLink"
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAffiliateLink = async ({
    payload: { payload, organizationName, affiliateName, eventPoster },
  }: {
    payload: AffiliateLinkInfo;
  }) => {
    setLoading(true);
    toast({
      description: "sending email...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `marketing/affiliate/link`,
        payload: { payload, affiliateName, organizationName, eventPoster },
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

export const useGetAffiliateLinks = (): UseGetResult<
  TAffiliateLink[],
  "affiliateLinks",
  "getAffiliateLinks"
> => {
  const [affiliateLinks, setAffiliateLinks] = useState<TAffiliateLink[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAffiliateLinks = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAffiliateLink[]>({
        endpoint: "marketing/affiliate/link",
      });

      if (status !== 200) {
        throw data;
      }
      setAffiliateLinks(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAffiliateLinks();
  }, []);

  return {
    affiliateLinks,
    isLoading,
    error,
    getAffiliateLinks,
  };
};

export const useGetAffiliateLink = ({
  linkId,
}: {
  linkId: number;
}): UseGetResult<TAffiliateLink, "affiliateLink", "getAffiliateLink"> => {
  const [affiliateLink, setAffiliateLink] = useState<TAffiliateLink | null>(
    null
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAffiliateLink = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAffiliateLink>({
        endpoint: `marketing/affiliate/link/${linkId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setAffiliateLink(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAffiliateLink();
  }, []);

  return {
    affiliateLink,
    isLoading,
    error,
    getAffiliateLink,
  };
};

export const useUpdateAffiliate = ({
  affiliateId,
}: {
  affiliateId: number;
}): usePostResult<Partial<TAffiliate>, "updateAffiliate"> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAffiliate = async ({
    payload,
  }: {
    payload: Partial<TAffiliate>;
  }) => {
    setLoading(true);
    toast({
      description: "updating affiliate...",
    });
    try {
      console.log(affiliateId, "affiliateId");
      const { data, status } = await postRequest({
        endpoint: `marketing/affiliate/${affiliateId}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Affiliate updated successfully",
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

  return { updateAffiliate, isLoading, error };
};
