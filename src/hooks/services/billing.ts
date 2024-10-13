"use client";

import { toast } from "@/components/ui/use-toast";
import {
  IBank,
  IBankCountry,
  IPayOut,
  IResolvedAccount,
  TEventTransaction,
} from "@/types/billing";
import { RequestStatus, UseGetResult, usePostResult } from "@/types/request";
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
  organizationId,
  eventId,
}: {
  organizationId?: number;
  userId?: number;
  userEmail?: string;
  registrationCompleted?: number;
  payOutStatus?: number;
  eventId?: string;
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
          userEmail ? "userEmail=" + userEmail + "&" : ""
        }${
          registrationCompleted
            ? "registrationCompleted=" + registrationCompleted + "&"
            : ""
        }${payOutStatus ? "payOutStatus=" + payOutStatus + "&" : ""}${
          organizationId ? "organizationId=" + organizationId + "&" : ""
        }${eventId ? "eventId=" + eventId + "&" : ""}`,
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
  }, [userId, organizationId]);

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
    payload: {
      transactionId: string[];
      amount: number;
      requestedFor: number;
      userEmail: string;
      userName: string;
    };
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
    payload: {
      transactionId: string[];
      amount: number;
      requestedFor: number;
      userEmail: string;
      userName: string;
    };
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

export const useGetBanks = ({
  country,
}: {
  country: string;
}): UseGetResult<IBank[], "banks", "getBanks"> => {
  const [banks, setBanks] = useState<IBank[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getBanks = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<IBank[]>({
        endpoint: `/billing/banks${country ? "?country=" + country : ""}`,
      });

      if (status !== 200) {
        throw data;
      }
      setBanks(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanks();
  }, [country]);

  return {
    banks,
    isLoading,
    error,
    getBanks,
  };
};

export const useGetCountries = (): UseGetResult<
  IBankCountry[],
  "countries",
  "getCountries"
> => {
  const [countries, setCountries] = useState<IBankCountry[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCountries = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<IBankCountry[]>({
        endpoint: `/billing/banks/country`,
      });

      if (status !== 200) {
        throw data;
      }
      setCountries(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return {
    countries,
    isLoading,
    error,
    getCountries,
  };
};

export const useResolveAccountNumber = (): usePostResult<
  {
    accountNumber: string;
    bankCode: string;
  },
  "resolveAccountNumber",
  IResolvedAccount
> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const resolveAccountNumber = async ({
    payload: { accountNumber, bankCode },
  }: {
    payload: {
      accountNumber: string;
      bankCode: string;
    };
  }) => {
    try {
      setLoading(true);
      // toast({ description: "resolveing badge..." });
      console.log("here");
      const { data, status } = await getRequest<IResolvedAccount>({
        endpoint: `/billing/banks/account/resolve?accountNumber=${accountNumber}&bankCode=${bankCode}`,
      });

      if (status !== 200) {
        throw data;
      }

      if (!data.data) {
        toast({
          description: "account number not valid",
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

  return { isLoading, error, resolveAccountNumber };
};
