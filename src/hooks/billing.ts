import { toast } from "@/components/ui/use-toast";
import { TEventTransaction } from "@/types/billing";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type UseGetBillingsResult = {
  billings: TEventTransaction[];
  getBillings: () => Promise<void>;
} & RequestStatus;

export const useGetBillings = ({
  userId,
}: {
  userId: number;
}): UseGetBillingsResult => {
  const [billings, setBillings] = useState<TEventTransaction[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBillings = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TEventTransaction[]>({
        endpoint: `/billing/${userId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setBillings(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBillings();
  }, [userId]);

  return { billings, isLoading, error, getBillings };
};
