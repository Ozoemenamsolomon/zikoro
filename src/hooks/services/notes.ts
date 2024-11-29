"use client";

import { TAttendeeNote } from "@/types/attendee";
import { RequestStatus } from "@/types/request";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

type useUpdatenoteResult = {
  updatenote: ({ payload }: { payload: TAttendeeNote }) => void;
} & RequestStatus;

export const useUpdatenote = ({
  attendeeId,
  userId,
}: {
  attendeeId: number;
  userId: number;
}): useUpdatenoteResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updatenote = async ({ payload }: { payload: TAttendeeNote }) => {
    setLoading(true);

    const { data, status } = await postRequest({
      endpoint: `/attendees/${attendeeId}/notes`,
      payload,
    });

    setLoading(false);

    if (status !== 201) return setError(true);
  };

  return { updatenote, isLoading, error };
};

type UseGetnoteResult = {
  note: TAttendeeNote | null;
  getnote: () => Promise<void>;
} & RequestStatus;

export const useGetnote = ({
  attendeeId,
  userId,
}: {
  attendeeId: number;
  userId: number;
}): UseGetnoteResult => {
  const [note, setNote] = useState<TAttendeeNote | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getnote = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeNote>({
        endpoint: `/attendees/${attendeeId}/notes?userId=${userId}`,
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
