"use client";

import { toast } from "@/components/ui/use-toast";
import { RequestStatus } from "@/types/request";
import { TAttendeeTags, TTags } from "@/types/tags";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type useUpdateTagsResult = {
  updateTags: ({ payload }: { payload: TTags }) => Promise<void>;
} & RequestStatus;

export const useUpdateTags = ({
  userId,
}: {
  userId: number;
}): useUpdateTagsResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateTags = async ({ payload }: { payload: TTags }) => {
    setLoading(true);
    toast({
      description: "updating tag...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `/tags/${userId}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "tags updated successfully",
      });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { updateTags, isLoading, error };
};

type UseGetTagsResult = {
  tags: TTags | null;
  getTags: () => Promise<void>;
} & RequestStatus;

export const useGetTags = ({
  userId,
}: {
  userId: number;
}): UseGetTagsResult => {
  const [tags, setTags] = useState<TTags | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getTags = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TTags>({
        endpoint: `/tags/${userId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setTags(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTags();
  }, [userId]);

  return { tags, isLoading, error, getTags };
};

type useUpdateAttendeeTagsResult = {
  updateAttendeeTags: ({
    payload,
  }: {
    payload: Partial<TAttendeeTags>;
  }) => Promise<void>;
} & RequestStatus;

export const useUpdateAttendeeTags = ({
  attendeeId,
}: {
  attendeeId: number;
}): useUpdateAttendeeTagsResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendeeTags = async ({
    payload,
  }: {
    payload: Partial<TAttendeeTags>;
  }) => {
    setLoading(true);

    toast({
      description: "updating attendee tags...",
    });

    try {
      
      const { data, status } = await postRequest({
        endpoint: `/attendees/${attendeeId}/tags`,
        payload,
      });

      
      if (status !== 201) throw data;
      toast({
        description: "Attendee tags updated successfully",
      });
    } catch (error) {
      
      setError(true);
    } finally {
      
      setLoading(false);
    }
  };

  return { updateAttendeeTags, isLoading, error };
};

type UseGetAttendeeTagsResult = {
  attendeeTags: TAttendeeTags | null;
  getAttendeeTags: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeeTags = ({
  attendeeId,
}: {
  attendeeId: number;
}): UseGetAttendeeTagsResult => {
  const [attendeeTags, setTags] = useState<TAttendeeTags | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeeTags = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeTags>({
        endpoint: `/attendees/${attendeeId}/tags`,
      });

      if (status !== 200) throw data;

      setTags(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeeTags();
  }, [attendeeId]);

  return { attendeeTags, isLoading, error, getAttendeeTags };
};

type UseGetAttendeesTagsResult = {
  attendeesTags: TAttendeeTags[];
  getAttendeesTags: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeesTags = ({
  userId,
}: {
  userId: number;
}): UseGetAttendeesTagsResult => {
  const [attendeesTags, setTags] = useState<TAttendeeTags[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeesTags = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeTags[]>({
        endpoint: `/attendees/tags/${userId}`,
      });

      if (status !== 200) throw data;

      setTags(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeesTags();
  }, []);

  return { attendeesTags, isLoading, error, getAttendeesTags };
};
