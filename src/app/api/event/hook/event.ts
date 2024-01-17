import {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";
import { revalidatePath } from "next/cache";

export const useCreateEvent = (formData: FormData) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAttendee = async ({ payload: { ...payload } }) => {
    setLoading(true);

    try {
      const { data, status } = (await postRequest({
        endpoint: "/event",
        payload,
      })) as {
        data: any;
        status: number;
      };

      if (status !== 200) {
        throw data?.data.error;
      }

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { createAttendee, isLoading, error };
};

export const useUpdateEvent = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendees = async ({ payload: { ...payload } }) => {
    setLoading(true);
    // toast({
    //   description: "Updating attendees",
    // });

    try {
      const { data, status } = (await patchRequest({
        endpoint: "/event",
        payload,
      })) as {
        data: any;
        status: number;
      };

      if (status !== 200) {
        throw data?.data.error;
      }

      console.log(data);
      //   toast({
      //     description: "Attendee created successfully",
      //   });
      return data;
    } catch (error) {
      setError(true);
      console.log(error);
      //   toast({
      //     description: error,
      //   });
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendees, isLoading, error };
};

export const useGetAttendees = () => {
  const [event, setEvent] = useState<[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<[]>({
      endpoint: "/event",
    });

    setLoading(false);

    if (status !== 200) {
      setError(true);
    }

    console.log(data.data);
    return setEvent(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { event, isLoading, error, getAttendees };
};
