import { toast } from "@/components/ui/use-toast";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import { deleteRequest } from "@/utils/api";

type RequestStatus = {
  isLoading: boolean;
  error: boolean;
};

type UseGetResult<TData> = {
  data: TData;
  getData: () => Promise<TData | undefined>;
} & RequestStatus;

type usePostResult<TData, TReturnData = any> = {
  mutateData: ({
    payload,
  }: {
    payload: TData;
  }) => Promise<TReturnData | undefined>;
} & RequestStatus;

export const useGetData = <TData>(
  endpoint: string,
  fetchInitial: boolean = true,
  defaultValue: any = null
): UseGetResult<TData> => {
  const [data, setData] = useState<TData>(defaultValue);
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
      console.log(responseData.data);
      return responseData.data;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitial && getData();
  }, [endpoint]);

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

  const mutateData = async ({
    payload,
    loadingMessage,
    confirmationMessage,
  }: {
    payload: TData;
    loadingMessage?: string;
    confirmationMessage?: string;
  }) => {
    try {
      setLoading(true);
      toast({ description: loadingMessage ?? "performing action..." });

      const { data, status } = await postRequest<TReturnData>({
        endpoint,
        payload,
      });

      console.log(status);
      if (status !== 201) {
        throw data;
      }

      toast({
        description: confirmationMessage ?? "action performed successfully",
      });

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



export const usePostRequest = <T>(endpoint: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const postData = async ({
    payload,
  }: {
    payload: T;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest<T>({
        endpoint: endpoint,
        payload,
      });

      toast({
        description: "Creation Attempt Successful",
      });
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { postData, isLoading };
};


export const useDeleteRequest = <T>(endpoint: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const deleteData = async () => {
    setLoading(true);

    try {
      const { data, status } = await deleteRequest<T>({
        endpoint:endpoint,
      });

      if (status !== 201) throw data.data;
      toast({
        description: " Delete successful",
      });

      return data.data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, isLoading };
};