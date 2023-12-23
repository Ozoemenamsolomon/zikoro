import { postRequest } from "@/utils/api";
import { useState } from "react";

export const useCreateAttendee = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAttendee = async () => {
    setLoading(true);

    const { data, status } = await postRequest({
      endpoint: "/attendees",
      payload: {},
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    return data;
  };

  return { createAttendee, isLoading, error };
};
