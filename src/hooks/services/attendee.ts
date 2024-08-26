"use client";
import { toast } from "@/components/ui/use-toast";
import {
  TAttendee,
  TAttendeeEmailInvites,
  TAttendeeInvites,
} from "@/types/attendee";
import { RequestStatus } from "@/types/request";
import { postRequest, getRequest, patchRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateAttendee = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createAttendee = async ({ payload }: { payload: TAttendee }) => {
    setLoading(true);

    toast({
      description: "Creating attendee...",
    });

    try {
      const { data, status } = await postRequest({
        endpoint: "/attendees",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
        });

      toast({
        description: "Attendee created successfully",
      });
      return data;
    } catch (error) {
      setError(true);

      toast({
        description: error.response.data.error,
        variant: "destructive",
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
    payload: Partial<TAttendee>[];
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

      if (status !== 200) throw data;

      toast({
        description: message || "Attendee created successfully",
      });
      return data;
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong, try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendees, isLoading, error };
};

export const useUploadAttendees = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const uploadAttendees = async ({
    payload,
    message,
  }: {
    payload: Partial<TAttendee>[];
    message?: string;
  }) => {
    setLoading(true);
    toast({
      description: "Uploading attendees...",
    });

    try {
      const { data, status } = await postRequest<TAttendee[]>({
        endpoint: "/attendees/upload",
        payload,
      });

      if (status !== 201) throw data;

      toast({
        description: "Attendee uploaded successfully",
      });
      return data;
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong, try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return { uploadAttendees, isLoading, error };
};

export const useGetAttendees = ({
  eventId,
  userId,
}: {
  eventId?: string;
  userId?: string;
}) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: `/attendees?${eventId ? "eventId=" + eventId : ""}${
        userId ? "userId=" + userId : ""
      }`,
    });

    //

    setLoading(false);

    if (status !== 200) return setError(true);

    //
    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, [eventId]);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetAttendee = ({
  userId,
  attendeeId,
  isAlias = false,
}: {
  attendeeId: string;
  isAlias: boolean;
}) => {
  const [attendee, setAttendee] = useState<TAttendee | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendee = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TAttendee>({
        endpoint: `/attendees/${attendeeId}?isAlias=${isAlias ? 1 : 0}`,
      });

      if (status !== 200) {
        throw data;
      }
      setAttendee(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendee();
  }, [attendeeId]);

  return { attendee, isLoading, error, getAttendee };
};

export const useGetAttendeeWithEmail = ({
  email,
  eventId,
}: {
  email: string;
  eventId: string;
}) => {
  const [attendee, setAttendee] = useState<TAttendee | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendee = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TAttendee[]>({
        endpoint: `/attendees?email=${email}&eventId=${eventId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setAttendee(data.data[0]);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendee();
  }, [email, eventId]);

  return { attendee, isLoading, error, getAttendee };
};

export const useGetAttendeesWithTags = ({ userId }: { userId: string }) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: `/tags/${userId}/attendees`,
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

    return setAttendees(data.data);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetAttendeesWithFavourites = ({
  userId,
}: {
  userId: string;
}) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: `/favourites/${userId}/attendees`,
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

export const useGetAttendeesWithCertificates = ({
  eventId,
}: {
  eventId: string;
}) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: "/certificates/${eventId}/attendees",
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

export const useInviteAttendees = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const inviteAttendees = async ({
    payload,
  }: {
    payload: {
      message: string;
      invitees: {
        email: string;
        name: string;
        role: string;
      }[];
      eventAlias: string;
    };
  }) => {
    setLoading(true);

    try {
      toast({
        description: "sending invites...",
      });
      const { data, status } = await postRequest({
        endpoint: "/attendees/invites",
        payload,
      });

      if (status !== 201) throw data;

      toast({
        description: "Invitees sent successfully",
      });
      return data;
    } catch (error) {
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
  getEmailInvites: () => Promise<void>;
} & RequestStatus;

export const useGetEmailInvites = ({
  eventId,
}: {
  eventId: number;
}): UseGetEmailInvitesResult => {
  const [emailInvites, setEmailInvites] = useState<TAttendeeEmailInvites[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEmailInvites = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeEmailInvites[]>({
        endpoint: `/attendees/invites?eventId=${eventId}`,
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

export const useGetAttendeesWithNotes = ({ userId }: { userId: string }) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendees = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TAttendee[]>({
      endpoint: `/notes/${userId}/attendees`,
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

export const useGetAllAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const getAttendees = async () => {
    try {
      setLoading(true);

      const { data, status } = await getRequest<TAttendee[]>({
        endpoint: `/attendees/all/${eventId}`,
      });

      if (status !== 200) return setError(true);

      //
      return setAttendees(data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, error, getAttendees };
};

export const useGetEventAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<TAttendee[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const getAttendees = async () => {
    try {
      setLoading(true);

      const { data, status } = await getRequest<TAttendee[]>({
        endpoint: `/attendees/event/${eventId}`,
      });

      setLoading(false);

      //
      return setAttendees(data.data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.response?.data?.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return { attendees, isLoading, getAttendees };
};
