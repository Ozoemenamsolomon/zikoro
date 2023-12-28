import { TAttendeeTags } from "@/types/attendee";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

type useUpdateTagsResult = {
  updateTags: ({ payload }: { payload: TAttendeeTags }) => void;
} & RequestStatus;

export const useUpdateTags = ({
  attendeeId,
}: {
  attendeeId: number;
}): useUpdateTagsResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateTags = async ({ payload }: { payload: TAttendeeTags }) => {
    console.log(attendeeId, "attendeeId");
    setLoading(true);

    const { data, status } = await postRequest({
      endpoint: `/attendees/${attendeeId}/tags`,
      payload,
    });

    setLoading(false);

    if (status !== 201) return setError(true);

    console.log(data);
  };

  return { updateTags, isLoading, error };
};

type UseGetTagsResult = {
  tags: TAttendeeTags[];
  getTags: () => Promise<void>;
} & RequestStatus;

export const useGetTags = ({
  attendeeId,
}: {
  attendeeId: number;
}): UseGetTagsResult => {
  const [tags, setTags] = useState<TAttendeeTags[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getTags = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeTags[]>({
        endpoint: `/attendees/${attendeeId}/tags`,
      });

      if (status !== 200) {
        throw data;
      } else {
        setTags(data.data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTags();
  }, [attendeeId]);

  return { tags, isLoading, error, getTags };
};
