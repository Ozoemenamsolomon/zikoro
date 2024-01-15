import { TAttendeeNote } from "@/types/attendee";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

type useUpdatenoteResult = {
  updatenote: ({ payload }: { payload: TAttendeeNote }) => void;
} & RequestStatus;

export const useUpdatenote = ({
  attendeeId,
}: {
  attendeeId: number;
}): useUpdatenoteResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updatenote = async ({ payload }: { payload: TAttendeeNote }) => {
    console.log(attendeeId, "attendeeId");
    setLoading(true);

    const { data, status } = await postRequest({
      endpoint: `/attendees/${attendeeId}/notes`,
      payload,
    });

    setLoading(false);

    if (status !== 201) return setError(true);

    console.log(data);
  };

  return { updatenote, isLoading, error };
};

type UseGetnoteResult = {
  notes: TAttendeeNote[];
  getnote: () => Promise<void>;
} & RequestStatus;

export const useGetnote = ({
  attendeeId,
}: {
  attendeeId: number;
}): UseGetnoteResult => {
  const [note, setNote] = useState<TAttendeeNote | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getnote = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeNote>({
        endpoint: `/attendees/${attendeeId}/notes`,
      });

      if (status !== 200) {
        throw data;
      } else {
        setNote(data.data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getnote();
  }, [attendeeId]);

  return { note, isLoading, error, getnote };
};
