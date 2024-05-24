import { toast } from "@/components/ui/use-toast";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type RequestStatus = {
  isLoading: boolean;
  error: boolean;
};

type UseGetResult<TData> = {
  data: TData | null;
  getData: () => Promise<void>;
} & RequestStatus;

type usePostResult<TData, TReturnData = any> = {
  mutateData: ({ payload }: { payload: TData }) => Promise<TReturnData | undefined>;
} & RequestStatus;

export const useGetData = <TData>(endpoint: string): UseGetResult<TData> => {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getData = async () => {
    setLoading(true);

    try {
      const { data: responseData, status } = await getRequest<TData>({
        endpoint,
      });

      if (status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(responseData.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    data,
    isLoading,
    error,
    getData,
  };
};

export const useMutateData = <TData, TReturnData = any>(
  endpoint: string
): usePostResult<TData, TReturnData> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const mutateData = async ({ payload }: { payload: TData }) => {
    try {
      setLoading(true);
      toast({ description: "performing action..." });

      const { data, status } = await postRequest<TReturnData>({
        endpoint,
        payload,
      });

      if (status !== 200) {
        throw data;
      }

      if (!data.data) {
        toast({
          description: "this badge is not valid",
          variant: "destructive",
        });
        setError(true);
      }

      return data.data;
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, error, mutateData };
};