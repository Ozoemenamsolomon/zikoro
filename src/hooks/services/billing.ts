"use client";

import { toast } from "@/components/ui/use-toast";
import { TEventTransaction } from "@/types/billing";
import { RequestStatus } from "@/types/request";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type UseGetEventTransactionsResult = {
  eventTransactions: TEventTransaction[];
  getEventTransactions: () => Promise<void>;
} & RequestStatus;

export const useGetEventTransactions = ({
  userId,
  registrationCompleted,
  payOutStatus,
}: {
  userId?: number;
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
        endpoint: `/billing?${userId ? "userId=" + userId + "&" : ""}${
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
  requestPayOut: ({ payload }: { payload: string[] }) => Promise<void>;
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
