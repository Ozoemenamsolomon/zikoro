import { toast } from "@/components/ui/use-toast";
import { TBadgeTemplate, TBadge } from "@/types/badge";
import { UseGetResult } from "@/types/request";
import { deleteRequest, getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

export const useSaveBadge = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const saveBadge = async ({ payload }: { payload: TBadge }) => {
    setLoading(true);
    toast({
      description: "saving badge...",
    });
    try {
      const { data, status } = await postRequest<TBadge>({
        endpoint: "/badges",
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Badge Saved Successfully",
      });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { saveBadge, isLoading, error };
};

export const useDeleteBadge = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const deleteBadge = async ({ badgeId }: { badgeId: number }) => {
    setLoading(true);
    toast({
      description: "deleting badge...",
    });
    try {
      const { data, status } = await deleteRequest<TBadge>({
        endpoint: `/badges/${badgeId}`,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Badge deleted successfully",
      });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { deleteBadge, isLoading, error };
};

export const useGetBadge = ({
  badgeId,
}: {
  badgeId: string;
}): UseGetResult<TBadge, "badge", "getBadge"> => {
  const [badge, setBadges] = useState<TBadge | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBadge = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TBadge>({
        endpoint: `/badges/${badgeId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setBadges(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBadge();
  }, [badgeId]);

  return { badge, isLoading, error, getBadge };
};

export const useGetBadges = (): UseGetResult<
  TBadge[],
  "badges",
  "getBadges"
> => {
  const [badges, setBadges] = useState<TBadge[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBadges = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TBadge[]>({
        endpoint: `/badges`,
      });

      if (status !== 200) {
        throw data;
      }
      setBadges(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBadges();
  }, []);

  return { badges, isLoading, error, getBadges };
};

export const useGetBadgeTemplates = (): UseGetResult<
  TBadgeTemplate[],
  "badgeTemplates",
  "getBadgeTemplates"
> => {
  const [badgeTemplates, setBadgeTemplates] = useState<TBadgeTemplate[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBadgeTemplates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TBadgeTemplate[]>({
        endpoint: "/badge/templates",
      });

      if (status !== 200) {
        throw data;
      }
      setBadgeTemplates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBadgeTemplates();
  }, []);

  return {
    badgeTemplates,
    isLoading,
    error,
    getBadgeTemplates,
  };
};
