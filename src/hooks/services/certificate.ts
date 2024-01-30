import { toast } from "@/components/ui/use-toast";
import { TAttendee } from "@/types/attendee";
import { TAttendeeCertificate, TCertificate, TFullCertificate } from "@/types/certificates";
import { deleteRequest, getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type UseGetEventCertificatesResult = {
  eventCertificates: TCertificate[];
  getEventCertificates: () => Promise<void>;
} & RequestStatus;

export const useGetEventCertificates = ({
  eventId,
}: {
  eventId: number;
}): UseGetEventCertificatesResult => {
  const [eventCertificates, setEventCertificates] = useState<TCertificate[]>(
    []
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEventCertificates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TCertificate[]>({
        endpoint: `/certificates/${eventId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setEventCertificates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventCertificates();
  }, [eventId]);

  return { eventCertificates, isLoading, error, getEventCertificates };
};

type UseGetAttendeesCertificatesResult = {
  attendeesCertificates: TAttendeeCertificate[];
  getAttendeesCertificates: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeesCertificates = ({
  eventId,
}: {
  eventId: number;
}): UseGetAttendeesCertificatesResult => {
  const [attendeesCertificates, setAttendeesCertificates] = useState<
    TAttendeeCertificate[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeesCertificates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeCertificate[]>({
        endpoint: `/certificates/${eventId}/attendees`,
      });

      if (status !== 200) {
        throw data;
      }
      setAttendeesCertificates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeesCertificates();
  }, [eventId]);

  return { attendeesCertificates, isLoading, error, getAttendeesCertificates };
};

type useUpdateAttendeeCertificatesResult = {
  updateAttendeeCertificates: ({
    payload,
  }: {
    payload: {
      certificateInfo: Partial<TAttendeeCertificate>;
      attendeeInfo: { attendeeId: number; attendeeEmail: string }[];
      action: string;
    };
  }) => Promise<void>;
} & RequestStatus;

export const useUpdateAttendeeCertificates = ({
  eventId,
}: {
  eventId: number;
}): useUpdateAttendeeCertificatesResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendeeCertificates = async ({
    payload,
  }: {
    payload: {
      certificateInfo: Partial<TAttendeeCertificate>;
      attendeeInfo: { attendeeId: number; attendeeEmail: string }[];
      action: string;
    };
  }) => {
    setLoading(true);
    toast({
      description: `${
        payload.action === "release" ? "releasing" : "recalling"
      } certificates...`,
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `/certificates/${eventId}/attendees`,
        payload,
      });

      if (status !== 201) throw data.data;

      toast({
        description: data.data?.msg,
      });
    } catch (error) {
      console.log(error);
      setError(true);
      toast({
        description: "an error has occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendeeCertificates, isLoading, error };
};

type UseGetAttendeeCertificatesResult = {
  attendeeCertificates: TAttendeeCertificate[];
  getAttendeeCertificates: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeeCertificates = ({
  eventId,
  attendeeId,
}: {
  eventId: number;
  attendeeId: number;
}): UseGetAttendeeCertificatesResult => {
  const [attendeeCertificates, setAttendeeCertificates] = useState<
    TAttendeeCertificate[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeeCertificates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TAttendeeCertificate[]>({
        endpoint: `/certificates/${eventId}/attendees/${attendeeId}`,
      });

      if (status !== 200) {
        throw data;
      }
      console.log(data.data);
      setAttendeeCertificates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeeCertificates();
  }, [eventId, attendeeId]);

  return { attendeeCertificates, isLoading, error, getAttendeeCertificates };
};

type useRecallAttendeeCertificatesResult = {
  recallAttendeeCertificates: ({
    payload,
  }: {
    payload: {
      certificateIds: number[];
    };
  }) => Promise<void>;
} & RequestStatus;

export const useRecallAttendeeCertificates = ({
  eventId,
  attendeeId,
}: {
  eventId: number;
  attendeeId: number;
}): useRecallAttendeeCertificatesResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const recallAttendeeCertificates = async ({
    payload,
  }: {
    payload: {
      certificateIds: number[];
    };
  }) => {
    setLoading(true);
    toast({
      description: "recalling certificates...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `/certificates/${eventId}/attendees/${attendeeId}`,
        payload,
      });

      if (status !== 201) throw data.data;

      toast({
        description: data.data?.msg,
      });
    } catch (error) {
      console.log(error);
      setError(true);
      toast({
        description: "an error has occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return { recallAttendeeCertificates, isLoading, error };
};

type UseVerifyAttendeeCertificateResult = {
  verifyAttendeeCertificate: (
    certificateId: string
  ) => Promise<TFullCertificate | null>;
} & RequestStatus;

export const useVerifyAttendeeCertificate =
  (): UseVerifyAttendeeCertificateResult => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const verifyAttendeeCertificate = async (
      certificateId: string
    ): Promise<TFullCertificate | null> => {
      setLoading(true);
      toast({
        description: "verifying certificate...",
      });

      try {
        const { data, status } = await getRequest<TFullCertificate>({
          endpoint: `/certificates/verify/${certificateId}`,
        });

        if (status !== 200) {
          throw data;
        }

        console.log(data.data);
        if (!data.data) {
          toast({
            description: "this certificate is not valid",
            variant: "destructive",
          });
          return null;
        }

        return data.data;
      } catch (error) {
        setError(true);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return { isLoading, error, verifyAttendeeCertificate };
  };
