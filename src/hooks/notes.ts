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

export const useGetNotes = () => {
  const [notes, setNotes] = useState<TNote[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getNotes = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TNote[]>({
      endpoint: "/attendees/notes",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    console.log(data.data);
    return setNotes(data.data);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return { notes, isLoading, error, getNotes };
};
