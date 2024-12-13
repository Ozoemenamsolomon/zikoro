"use client";
import { toast } from "@/components/ui/use-toast";
import {
  TBadgeTemplate,
  TBadge,
  TAttendeeBadge,
  TFullBadge,
} from "@/types/badge";
import { RequestStatus, UseGetResult, usePostResult } from "@/types/request";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "@/utils/api";
import { useEffect, useState } from "react";

export const useCreateBadge = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createBadge = async ({ payload }: { payload: Partial<TBadge> }) => {
    setLoading(true);
    toast({
      description: "creating badge...",
    });
    try {
      const { data, status } = await postRequest<Partial<TBadge>>({
        endpoint: "/badge",
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

  return { createBadge, isLoading, error };
};

export const useSaveBadge = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const saveBadge = async ({
    payload,
    badgeAlias,
  }: {
    payload: TBadge;
    badgeAlias: string;
  }) => {
    setLoading(true);
    toast({
      description: "saving badge...",
    });
    try {
      const { data, status } = await patchRequest<TBadge>({
        endpoint: "/badge/" + badgeAlias,
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

  const deleteBadge = async ({ badgeId }: { badgeId: number | string }) => {
    setLoading(true);
    toast({
      description: "deleting badge...",
    });
    try {
      const { data, status } = await deleteRequest<TBadge>({
        endpoint: `/badge/${badgeId}`,
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
  alias,
}: {
  alias: string;
}): UseGetResult<TBadge, "data", "getBadge"> => {
  const [badge, setBadges] = useState<TBadge | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBadge = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TBadge>({
        endpoint: `/badge/${alias}`,
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
  }, [alias]);

  return { data: badge, isLoading, error, getBadge };
};

export const useGetBadges = ({
  eventId,
}: {
  eventId?: string;
}): UseGetResult<TBadge[], "badges", "getBadges"> => {
  const [badges, setBadges] = useState<TBadge[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBadges = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TBadge[]>({
        endpoint: `/badge${eventId ? "?eventId=" + eventId : ""}`,
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

export const useReleaseAttendeeBadge = (): usePostResult<
  Partial<TAttendeeBadge>,
  "releaseAttendeeBadge",
  TAttendeeBadge
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const releaseAttendeeBadge = async ({
    payload,
  }: {
    payload: Partial<TAttendeeBadge>;
  }) => {
    setLoading(true);
    toast({
      description: "releasing badge...",
    });
    try {
      const { data, status } = await postRequest<TAttendeeBadge>({
        endpoint: `/badge/attendees/release`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Badge released successfully",
      });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { releaseAttendeeBadge, isLoading, error };
};

type UseGetAttendeesBadgesResult = {
  attendeesBadges: TAttendeeBadge[];
  getAttendeesBadges: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeesBadges = ({
  eventId,
}: {
  eventId: number;
}): UseGetAttendeesBadgesResult => {
  const [attendeesBadges, setAttendeesBadges] = useState<TAttendeeBadge[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeesBadges = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeBadge[]>({
        endpoint: `/badge/events/${eventId}/attendees`,
      });

      if (status !== 200) {
        throw data;
      }
      setAttendeesBadges(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeesBadges();
  }, [eventId]);

  return { attendeesBadges, isLoading, error, getAttendeesBadges };
};

type useUpdateAttendeeBadgesResult = {
  updateAttendeeBadges: ({
    payload,
  }: {
    payload: {
      badgeInfo: Partial<TAttendeeBadge>;
      attendeeInfo: { attendeeId?: number; attendeeEmail: string }[];
      action: string;
    };
  }) => Promise<void>;
} & RequestStatus;

export const useUpdateAttendeeBadges = ({
  eventId,
}: {
  eventId: number;
}): usePostResult<
  {
    badgeInfo: Partial<TAttendeeBadge>;
    attendeeInfo: { attendeeId?: number; attendeeEmail: string }[];
    action: string;
  },
  "updateAttendeeBadges",
  TFullBadge
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendeeBadges = async ({
    payload,
  }: {
    payload: {
      badgeInfo: Partial<TAttendeeBadge>;
      attendeeInfo: { attendeeId?: number; attendeeEmail: string }[];
      action: string;
    };
  }) => {
    setLoading(true);
    toast({
      description: `${
        payload.action === "release" ? "releasing" : "recalling"
      } badges...`,
    });
    try {
      const { data, status } = await postRequest<{ msg: string }>({
        endpoint: `/badge/events/${eventId}/attendees`,
        payload,
      });

      if (status !== 201) throw data.data;

      toast({
        description: data.data?.msg,
      });

      if (payload.action === "release") {
        return data.data;
      }
    } catch (error) {
      setError(true);
      toast({
        description: "an error has occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendeeBadges, isLoading, error };
};

type UseGetAttendeeBadgeResult = {
  attendeeBadge: TAttendeeBadge;
  getAttendeeBadge: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeeBadge = ({
  eventId,
  attendeeId,
}: {
  eventId: number;
  attendeeId: number;
}): UseGetAttendeeBadgeResult => {
  const [attendeeBadge, setAttendeeBadge] = useState<TAttendeeBadge>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeeBadge = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeBadge>({
        endpoint: `/badge/events/${eventId}/attendees/${attendeeId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setAttendeeBadge(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeeBadge();
  }, [eventId, attendeeId]);

  return { attendeeBadge, isLoading, error, getAttendeeBadge };
};

export const useVerifyAttendeeBadge = ({
  badgeId,
}: {
  badgeId: string;
}): UseGetResult<TFullBadge, "attendeeBadge", "verifyAttendeeBadge"> => {
  const [attendeeBadge, setAttendeeBadge] = useState<TFullBadge | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const verifyAttendeeBadge = async () => {
    try {
      setLoading(true);
      toast({ description: "verifying badge..." });

      const { data, status } = await getRequest<TFullBadge>({
        endpoint: `/badge/attendees/verify/${badgeId}`,
      });

      if (status !== 200) {
        throw data;
      }

      if (!data.data) {
        toast({
          description: "this badge is not valid",
          variant: "destructive",
        });
        setError(true);
      }

      setAttendeeBadge(data.data);
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAttendeeBadge();
  }, []);

  return { attendeeBadge, isLoading, error, verifyAttendeeBadge };
};
