"use client";

import { toast } from "@/components/ui/use-toast";
import { TAttendee } from "@/types/attendee";
import {
  CertificateTemplate,
  TAttendeeCertificate,
  TCertificate,
  TFullCertificate,
  TIssuedCertificate,
} from "@/types/certificates";
import { RequestStatus, UseGetResult, usePostResult } from "@/types/request";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "@/utils/api";
import { useEffect, useState } from "react";
import useUserStore from "@/store/globalUserStore";

export const useSaveCertificate = ({
  certificateAlias,
}: {
  certificateAlias: string;
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const saveCertificate = async ({ payload }: { payload: TCertificate }) => {
    setLoading(true);
    // toast({
    //   description: "saving certificate...",
    // });
    try {
      const { data, status } = await patchRequest<TCertificate>({
        endpoint: "/certificates/" + certificateAlias,
        payload,
      });

      if (status !== 201) throw data.data;
      // toast({
      //   description: "Certificate Saved Successfully",
      // });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { saveCertificate, isLoading, error };
};

export const useCreateCertificate = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createCertificate = async ({
    payload,
  }: {
    payload: { eventId: string };
  }) => {
    setLoading(true);
    toast({
      description: "creating certificate...",
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

  return { createCertificate, isLoading, error };
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
  alias,
}: {
  alias: string;
}): UseGetResult<TCertificate, "data", "getCertificate"> => {
  const [certificate, setCertificates] = useState<TCertificate | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCertificate = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TCertificate>({
        endpoint: `/certificates/${alias}`,
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
  }, [alias]);

  return { data:certificate, isLoading, error, getCertificate };
};

export const useGetCertificates = ({
  eventId,
}: {
  eventId?: number;
}): UseGetResult<TCertificate[], "certificates", "getCertificates"> => {
  const [certificates, setCertificates] = useState<TCertificate[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCertificates = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TCertificate[]>({
        endpoint: `/certificates${eventId ? "?eventId=" + eventId : ""}`,
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

      console.log(data, "event certificates");
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
}): usePostResult<
  {
    certificateInfo: Partial<TAttendeeCertificate>;
    attendeeInfo: { attendeeId?: number; attendeeEmail: string }[];
    action: string;
  },
  "updateAttendeeCertificates",
  TFullCertificate
> => {
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

      if (payload.action === "release") {
        return data.data;
      }
    } catch (error) {
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

export const useReleaseAttendeeCertificate = (): usePostResult<
  Partial<TAttendeeCertificate>,
  "releaseAttendeeCertificate",
  TAttendeeCertificate
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const releaseAttendeeCertificate = async ({
    payload,
  }: {
    payload: Partial<TAttendeeCertificate>;
  }) => {
    setLoading(true);
    toast({
      description: "releasing certificate...",
    });
    try {
      const { data, status } = await postRequest<TAttendeeCertificate>({
        endpoint: `/certificates/attendees/release`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Certificate released successfully",
      });
      return data.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { releaseAttendeeCertificate, isLoading, error };
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

export const useVerifyAttendeeCertificate = ({
  certificateId,
}: {
  certificateId: string;
}): UseGetResult<
  TFullCertificate,
  "attendeeCertificate",
  "verifyAttendeeCertificate"
> => {
  const [attendeeCertificate, setAttendeeCertificate] =
    useState<TFullCertificate | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  console.log(certificateId);

  const verifyAttendeeCertificate = async () => {
    console.log(certificateId);
    try {
      setLoading(true);
      toast({ description: "verifying certificate..." });

      console.log(certificateId);

      const { data, status } = await getRequest<TFullCertificate>({
        endpoint: `/certificates/attendees/verify/${certificateId}`,
      });

      if (status !== 200) {
        throw data;
      }

      if (!data.data) {
        toast({
          description: "this certificate is not valid",
          variant: "destructive",
        });
        setError(true);
      }

      setAttendeeCertificate(data.data);
    } catch (error) {
      console.log(error);
      setError(true);
      toast({
        description: "something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAttendeeCertificate();
  }, []);

  return { attendeeCertificate, isLoading, error, verifyAttendeeCertificate };
};

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

type UseGetAllEventAttendeeCertificatesResult = {
  attendeeCertificates: TIssuedCertificate[];
  getAttendeeCertificates: () => Promise<void>;
} & RequestStatus;

export const useGetAllEventAttendeesCertificates =
  (): UseGetAllEventAttendeeCertificatesResult => {
    const [attendeeCertificates, setAttendeeCertificates] = useState<
      TIssuedCertificate[]
    >([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getAttendeeCertificates = async () => {
      setLoading(true);

      try {
        const { data, status } = await getRequest<TIssuedCertificate[]>({
          endpoint: `/certificates/attendees/all`,
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
    }, []);

    return { attendeeCertificates, isLoading, error, getAttendeeCertificates };
  };

export function useGetUserCertificates() {
  const [userCertificates, setUserCertificates] = useState<
    TIssuedCertificate[]
  >([]);
  const { attendeeCertificates, isLoading } =
    useGetAllEventAttendeesCertificates();
  const { user, setUser } = useUserStore();
  // const user = getCookie("user");

  useEffect(() => {
    if (!isLoading && user) {
      const certificates = attendeeCertificates?.filter((certificate) => {
        return certificate?.attendeeEmail === user?.userEmail;
      });
      setUserCertificates(certificates);
    }
  }, [isLoading]);
  /**

 */

  return {
    attendeeCertificates: userCertificates,
    isLoading,
  };
}
