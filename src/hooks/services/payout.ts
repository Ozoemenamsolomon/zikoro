import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import { IPayOut } from "@/types/billing";
import { RequestStatus, UseGetResult, usePostResult } from "@/types/request";
import { IPayoutAccountDetails } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const useGetPayOuts = ({
  userId,
}: {
  userId: string;
}): UseGetResult<IPayOut[], "payOuts", "getPayOuts"> => {
  const [payOuts, setPayOuts] = useState<IPayOut[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getPayOuts = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<IPayOut[]>({
        endpoint: `payout`,
      });

      if (status !== 200) {
        throw data;
      }
      setPayOuts(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayOuts();
  }, []);

  return {
    payOuts,
    isLoading,
    error,
    getPayOuts,
  };
};

type useInitializePayOutResult = {
  initializePayOut: ({
    payload,
  }: {
    payload: {
      accountDetails: IPayoutAccountDetails;
      amount: number;
      reference: string;
    };
  }) => Promise<{ transferCode: string | null; status: boolean }>;
} & RequestStatus;

export const useInitializePayOut = (): useInitializePayOutResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const initializePayOut = async ({
    payload,
  }: {
    payload: {
      accountDetails: IPayoutAccountDetails;
      amount: number;
      reference: string;
    };
  }) => {
    setLoading(true);
    toast({
      description: "initializing payout...",
    });
    try {
      const { data, status } = await postRequest<{ transferCode: string }>({
        endpoint: `/payout/transfer/initialize`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "payout initialized successfully",
      });

      return { transferCode: data.data.transferCode, status: true };
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong",
        variant: "destructive",
      });
      return { status: false, transferCode: null };
    } finally {
      setLoading(false);
    }
  };

  return { initializePayOut, isLoading, error };
};

type useFinalizePayOutResult = {
  finalizePayOut: ({
    payload,
  }: {
    payload: {
      transferCode: string;
      OTP: number;
      payOutRef: string;
      paidOutBy: number;
      userEmail: string;
      userName: string;
      paidOutEmail: string;
      paidOutName: string;
      amount: number;
    };
  }) => Promise<{ reference: string | null; status: boolean }>;
} & RequestStatus;

export const useFinalizePayOut = (): useFinalizePayOutResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const finalizePayOut = async ({
    payload,
  }: {
    payload: {
      transferCode: string;
      OTP: number;
      payOutRef: string;
      paidOutBy: number;
      userEmail: string;
      userName: string;
      paidOutEmail: string;
      paidOutName: string;
      amount: number;
    };
  }) => {
    setLoading(true);
    toast({
      description: "verifying OTP...",
    });
    try {
      const { data, status } = await postRequest<{ reference: string }>({
        endpoint: `/payout/transfer/finalize`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "payout transfered successfully",
      });

      return { reference: data.data.reference, status: true };
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong",
        variant: "destructive",
      });
      return { status: false, reference: null };
    } finally {
      setLoading(false);
    }
  };

  return { finalizePayOut, isLoading, error };
};

type useResendOTPResult = {
  resendOTP: ({
    payload,
  }: {
    payload: {
      transferCode: string;
    };
  }) => Promise<{ status: boolean }>;
} & RequestStatus;

export const useResendOTP = (): useResendOTPResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const resendOTP = async ({
    payload,
  }: {
    payload: {
      transferCode: string;
    };
  }) => {
    setLoading(true);
    toast({
      description: "sending OTP...",
    });
    try {
      const { data, status } = await postRequest<{ reference: string }>({
        endpoint: `/payout/transfer/resend_otp`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "OTP sent successfully",
      });

      return { status: true };
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong",
        variant: "destructive",
      });
      return { status: false };
    } finally {
      setLoading(false);
    }
  };

  return { resendOTP, isLoading, error };
};
