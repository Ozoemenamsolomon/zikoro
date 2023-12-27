import { TNote } from "@/types/attendee";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateNote = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createNote = async ({ payload }: { payload: TNote }) => {
    setLoading(true);

    const { data, status } = await postRequest({
      endpoint: "/attendees/notes",
      payload,
    });

    setLoading(false);

    if (status !== 201) return setError(true);

    console.log(data);
    return data;
  };

  return { createNote, isLoading, error };
};

type UseGetNotesResult = {
  notes: TNote[];
  getNotes: () => Promise<void>;
} & RequestStatus;

export const useGetNotes = ({
  attendeeId,
}: {
  attendeeId: number;
}): UseGetNotesResult => {
  const [notes, setNotes] = useState<TNote[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getNotes = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TNote[]>({
        endpoint: `/attendees/${attendeeId}/notes`,
      });

      if (status !== 200) {
        throw data;
      } else {
        setNotes(data.data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, [attendeeId]);

  return { notes, isLoading, error, getNotes };
};
