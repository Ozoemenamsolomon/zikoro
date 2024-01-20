import { toast } from "@/components/ui/use-toast";
import { TAttendee, TAttendeeEmailInvites } from "@/types/attendee";
import { postRequest, getRequest, patchRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateAttendee = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAttendee = async ({ payload }: { payload: TAttendee }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/attendees",
        payload,
      });

      if (status !== 200) throw data.data.error;

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      setError(true);
      toast({
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return { createAttendee, isLoading, error };
};

export const useUpdateAttendees = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendees = async ({
    payload,
    message,
  }: {
    payload: TAttendee[];
    message?: string;
  }) => {
    setLoading(true);
    toast({
      description: "Updating attendees",
    });

    try {
      const { data, status } = await patchRequest<TAttendee[]>({
        endpoint: "/attendees",
        payload,
      });

      if (status !== 200) throw data.data.error;

      console.log(data);
      toast({
        description: message || "Attendee created successfully",
      });
      return data;
    } catch (error) {
      setError(true);
      console.log(error);
      toast({
        description: "something went wrong, try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendees, isLoading, error };
};

export const useGetAttendees = () => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: "/attendees",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    console.log(data.data);
    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetAttendeesWithTags = () => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: "/tags/10/attendees",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    console.log(data.data);
    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetAttendeesWithEmailInvites = () => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: "/emailinvites/10/attendees",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    console.log(data.data);
    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetAttendeesWithFavourites = () => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: "/favourites/10/attendees",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    console.log(data.data);
    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetAttendeesWithCertificates = () => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: "/certificates/1234567890/attendees",
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    console.log(data.data);
    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useInviteAttendees = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const inviteAttendees = async ({
    payload,
  }: {
    payload: TAttendeeEmailInvites;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/attendees/invites",
        payload,
      });

      if (status !== 201) throw data.data.error;

      toast({
        description: "Invitees sent successfuly",
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      setError(true);
      toast({
        description: "an error has occured",
      });
    } finally {
      setLoading(false);
    }
  };

  return { inviteAttendees, isLoading, error };
};

type UseGetEmailInvitesResult = {
  emailInvites: TAttendeeEmailInvites[];
  getemailinvites: () => Promise<void>;
} & RequestStatus;

export const useGetEmailInvites = (): UseGetEmailInvitesResult => {
  const [emailInvites, setEmailInvites] = useState<TAttendeeEmailInvites[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEmailInvites = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeEmailInvites[]>({
        endpoint: `/attendees/invites`,
      });

      if (status !== 200) {
        throw data;
      } else {
        setEmailInvites(data.data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmailInvites();
  }, []);

  return { emailInvites, isLoading, error, getEmailInvites };
};
