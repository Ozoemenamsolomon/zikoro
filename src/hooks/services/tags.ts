import { toast } from "@/components/ui/use-toast";
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
  tags: TTags;
  getTags: () => Promise<void>;
} & RequestStatus;

export const useGetTags = ({
  userId,
}: {
  userId: number;
}): UseGetTagsResult => {
  const [tags, setTags] = useState<TTags>({});
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

type useUpdateAttendeetagsResult = {
  updateAttendeetags: ({
    payload,
  }: {
    payload: TAttendeeTags;
  }) => Promise<void>;
} & RequestStatus;

export const useUpdateAttendeetags = ({
  attendeeId,
}: {
  attendeeId: number;
}): useUpdateAttendeetagsResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendeetags = async ({
    payload,
  }: {
    payload: TAttendeeTags;
  }) => {
    setLoading(true);

    toast({
      description: "updating attendee tags...",
    });

    try {
      console.log(payload, "starting update attendee tag");
      const { data, status } = await postRequest({
        endpoint: `/attendees/${attendeeId}/tags`,
        payload,
      });

      console.log("finish update attendee tag");
      if (status !== 201) throw data;
      toast({
        description: "Attendee tags updated successfully",
      });
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      console.log("done");
      setLoading(false);
    }
  };

  return { updateAttendeetags, isLoading, error };
};

type UseGetAttendeetagsResult = {
  attendeeTags: TAttendeeTags;
  getAttendeetags: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeetags = ({
  attendeeId,
}: {
  attendeeId: number;
}): UseGetAttendeetagsResult => {
  const [attendeeTags, setTags] = useState<TAttendeeTags>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeetags = async () => {
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
    getAttendeetags();
  }, [attendeeId]);

  return { attendeeTags, isLoading, error, getAttendeetags };
};
