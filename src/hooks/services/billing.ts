"use client";

import { toast } from "@/components/ui/use-toast";
import { IPayOut, TEventTransaction } from "@/types/billing";
import { RequestStatus, UseGetResult } from "@/types/request";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type UseGetEventTransactionsResult = {
  eventTransactions: TEventTransaction[];
  getEventTransactions: () => Promise<void>;
} & RequestStatus;

export const useGetEventTransactions = ({
  userEmail,
  userId,
  registrationCompleted,
  payOutStatus,
}: {
  userId?: number;
  userEmail?: string;
  registrationCompleted?: number;
  payOutStatus?: number;
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
        endpoint: `/billing?${
          userId ? "userId=" + userId + "&" : ""
        }${userEmail ? "userEmail=" + userEmail + "&" : ""}${
          registrationCompleted
            ? "registrationCompleted=" + registrationCompleted + "&"
            : ""
        }${payOutStatus ? "payOutStatus=" + payOutStatus + "&" : ""}`,
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

type UseGetAttendeeEventTransactionsResult = {
  attendeeEventTransactions: TEventTransaction | null;
  getAttendeeEventTransactions: () => Promise<void>;
} & RequestStatus;

export const useGetAttendeeEventTransactions = ({
  userId,
  eventRegistrationRef,
}: {
  userId: number;
  eventRegistrationRef: string;
}): UseGetAttendeeEventTransactionsResult => {
  const [attendeeEventTransactions, setAttendeeEventTransactions] =
    useState<TEventTransaction | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getAttendeeEventTransactions = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TEventTransaction>({
        endpoint: `/billing/${userId}/${eventRegistrationRef}`,
      });

      if (status !== 200) {
        throw data;
      }
      setAttendeeEventTransactions(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendeeEventTransactions();
  }, [userId]);

  return {
    attendeeEventTransactions,
    isLoading,
    error,
    getAttendeeEventTransactions,
  };
};

type useRequestPayOutResult = {
  requestPayOut: ({
    payload,
  }: {
    payload: { transactionId: string[]; amount: number };
  }) => Promise<void>;
} & RequestStatus;

export const useRequestPayOut = ({
  userId,
}: {
  userId: number;
}): useRequestPayOutResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const requestPayOut = async ({
    payload,
  }: {
    payload: { transactionId: string[]; amount: number };
  }) => {
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

export const useGetPayOuts = ({
  userId,
}: {
  userId: string;
}): UseGetResult<IPayOut[], "payOuts", "getPayOuts"> => {
  const [payOuts, setPayOuts] = useState<IPayOut[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  console.log("here");

  const getPayOuts = async () => {
    setLoading(true);
    console.log("here");
    try {
      console.log("here");
      const { data, status } = await getRequest<IPayOut[]>({
        endpoint: `/billing/${userId}/payout`,
      });

      console.log(data);

      if (status !== 200) {
        throw data;
      }
      setPayOuts(data.data);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("here");
    getPayOuts();
  }, []);

  return {
    payOuts,
    isLoading,
    error,
    getPayOuts,
  };
};

export const useGetBanks = (): UseGetResult<IBank[], "banks", "getBanks"> => {
  const [banks, setBanks] = useState<IBank[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  console.log("here");

  const getBanks = async () => {
    setLoading(true);
    console.log("here");
    try {
      console.log("here");
      const { data, status } = await getRequest<IBank[]>({
        endpoint: `/billing/bank`,
      });

      console.log(data);

      if (status !== 200) {
        throw data;
      }
      setBanks(data.data);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("here");
    getBanks();
  }, []);

  return {
    banks,
    isLoading,
    error,
    getBanks,
  };
};