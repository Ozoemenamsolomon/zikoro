import { toast } from "@/components/ui/use-toast";
import { TAttendee } from "@/types/attendee";
import {
  CertificateTemplate,
  TAttendeeCertificate,
  TCertificate,
  TFullCertificate,
} from "@/types/certificates";
import { RequestStatus, UseGetResult, usePostResult } from "@/types/request";
import { deleteRequest, getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

export const useSaveCertificate = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const saveCertificate = async ({ payload }: { payload: TCertificate }) => {
    setLoading(true);
    toast({
      description: "saving certificate...",
    });
    try {
      const { data, status } = await postRequest<TCertificate>({
        endpoint: "/certificates",
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Certificate Saved Successfully",
      });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { saveCertificate, isLoading, error };
};

export const useDeleteCertificate = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const deleteCertificate = async ({
    certificateId,
  }: {
    certificateId: number;
  }) => {
    setLoading(true);
    toast({
      description: "deleting certificate...",
    });
    try {
      const { data, status } = await deleteRequest<TCertificate>({
        endpoint: `/certificates/${certificateId}`,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Certificate deleted successfully",
      });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { deleteCertificate, isLoading, error };
};

export const useGetCertificate = ({
  certificateId,
}: {
  certificateId: string;
}): UseGetResult<TCertificate, "certificate", "getCertificate"> => {
  const [certificate, setCertificates] = useState<TCertificate | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCertificate = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TCertificate>({
        endpoint: `/certificates/${certificateId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setCertificates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCertificate();
  }, [certificateId]);

  return { certificate, isLoading, error, getCertificate };
};

export const useGetCertificates = (): UseGetResult<
  TCertificate[],
  "certificates",
  "getCertificates"
> => {
  const [certificates, setCertificates] = useState<TCertificate[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCertificates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TCertificate[]>({
        endpoint: `/certificates`,
      });

      if (status !== 200) {
        throw data;
      }
      setCertificates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  return { certificates, isLoading, error, getCertificates };
};

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
        endpoint: `/certificates/events/${eventId}`,
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
        endpoint: `/certificates/events/${eventId}/attendees`,
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
      attendeeInfo: { attendeeId?: number; attendeeEmail: string }[];
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
      attendeeInfo: { attendeeId?: number; attendeeEmail: string }[];
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
      const { data, status } = await postRequest<{ msg: string }>({
        endpoint: `/certificates/events/${eventId}/attendees`,
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
        endpoint: `/certificates/events/${eventId}/attendees/${attendeeId}`,
      });

      if (status !== 200) {
        throw data;
      }
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
      const { data, status } = await postRequest<{ msg: string }>({
        endpoint: `/certificates/events/${eventId}/attendees/${attendeeId}`,
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

type UseGetAttendeeCertificateResult = {
  getAttendeeCertificate: ({
    certificateId,
    certificateGroupId,
    isVerify,
  }: {
    certificateId?: string;
    certificateGroupId?: number;
    isVerify?: boolean;
  }) => Promise<TFullCertificate | TFullCertificate[] | null>;
} & RequestStatus;

export const useGetAttendeeCertificate = (
  isSilent?: boolean
): UseGetAttendeeCertificateResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeeCertificate = async ({
    certificateId,
    certificateGroupId,
    isVerify = true,
  }: {
    certificateId?: string;
    certificateGroupId?: number;
    isVerify?: boolean;
  }): Promise<TFullCertificate | TFullCertificate[] | null> => {
    setLoading(true);

    if (!isSilent) {
      toast({
        description: isVerify
          ? "verifying certificate..."
          : "getting certificate...",
      });
    }

    try {
      const { data, status } = await getRequest<
        TFullCertificate | TFullCertificate[]
      >({
        endpoint: `/certificates/attendees?${
          (certificateId && `certificateId=${certificateId}&`) || ""
        }${
          (certificateGroupId && `certificateGroupId=${certificateGroupId}`) ||
          ""
        }`,
      });

      if (status !== 200) {
        throw data;
      }

      if (!data.data) {
        if (isVerify) {
          toast({
            description: "this certificate is not valid",
            variant: "destructive",
          });
        }
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

  return { isLoading, error, getAttendeeCertificate };
};

export const useGetCertificateTemplates = (): UseGetResult<
  CertificateTemplate[],
  "certificateTemplates",
  "getCertificateTemplates"
> => {
  const [certificateTemplates, setCertificateTemplates] = useState<
    CertificateTemplate[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCertificateTemplates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<CertificateTemplate[]>({
        endpoint: "/certificates/templates",
      });

      if (status !== 200) {
        throw data;
      }
      setCertificateTemplates(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCertificateTemplates();
  }, []);

  return {
    certificateTemplates,
    isLoading,
    error,
    getCertificateTemplates,
  };
};
