import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateAttendee = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAttendee = async ({ payload }) => {
    setLoading(true);

    const { data, status } = await postRequest({
      endpoint: "/attendees",
      payload,
    });

    setLoading(false);

    if (status !== 201) return setError(true);

    console.log(data)
    return data;
  };

  return { createAttendee, isLoading, error };
};

export const useGetAttendees = () => {
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest({
      endpoint: "/attendees",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};
