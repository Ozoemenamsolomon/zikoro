import { toast } from "@/components/ui/use-toast";
import { TAttendeeCertificate, TCertificate } from "@/types/certificates";
import { getRequest, postRequest } from "@/utils/api";
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

type useUpdateAttendeeCertificatesResult = {
  updateAttendeeCertificates: ({
    payload,
  }: {
    payload: TAttendeeCertificate;
  }) => Promise<void>;
} & RequestStatus;

export const useUpdateAttendeeCertificates = ({
  userId,
}: {
  userId: number;
}): useUpdateAttendeeCertificatesResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateAttendeeCertificates = async ({
    payload,
  }: {
    payload: TAttendeeCertificate;
  }) => {
    setLoading(true);
    toast({
      description: "updating favourite...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `/favourites/${userId}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "favourites updated successfully",
      });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendeeCertificates, isLoading, error };
};
