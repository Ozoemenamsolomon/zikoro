import { toast } from "@/components/ui/use-toast";
import { TEventTransaction } from "@/types/billing";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type UseGetEventTransactionsResult = {
  eventTransactions: TEventTransaction[];
  getEventTransactions: () => Promise<void>;
} & RequestStatus;

export const useGetEventTransactions = ({
  userId,
}: {
  userId: number;
}): UseGetEventTransactionsResult => {
  const [eventTransactions, setEventTransactions] = useState<
    TEventTransaction[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getEventTransactions = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TEventTransaction[]>({
        endpoint: `/billing/${userId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setEventTransactions(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventTransactions();
  }, [userId]);

  return { eventTransactions, isLoading, error, getEventTransactions };
};

type useRequestPayOutResult = {
  requestPayOut: ({ payload }: { payload: TFavouriteContact }) => Promise<void>;
} & RequestStatus;

export const useRequestPayOut = ({
  userId,
}: {
  userId: number;
}): useRequestPayOutResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const requestPayOut = async ({ payload }: { payload: string[] }) => {
    setLoading(true);
    toast({
      description: "requesting payout...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `/billing/${userId}/payout/request`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "payout requested successfully",
      });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { requestPayOut, isLoading, error };
};
