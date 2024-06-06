"use client";

import { toast } from "@/components/ui/use-toast";
import { RequestStatus, UseGetResult } from "@/types/request";
import { TUser } from "@/types/user";
import { postRequest, getRequest, patchRequest } from "@/utils/api";
import { useState, useEffect } from "react";

export const useGetUser = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getUser = async () => {
    setLoading(true);
    //
    const { data, status } = await getRequest<TUser>({
      endpoint: `/users/${userId}`,
    });

    setLoading(false);

    if (status !== 200) return setError(true);

    return setUser(data.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user, isLoading, error, getUser };
};

export const useCreateUser = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createUser = async ({ payload }: { payload: TUser }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/users",
        payload,
      });

      if (status !== 201)
        return toast({
          description: data.data.error,
          variant: "destructive",
        });

      toast({
        description: "User created successfully",
      });
      return data;
    } catch (error) {
      setError(true);
      toast({
        description: error.response.data.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createUser, isLoading, error };
};

export const useUpdateUsers = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateUsers = async ({
    payload,
    message,
  }: {
    payload: Partial<TUser>[];
    message?: string;
  }) => {
    setLoading(true);
    toast({
      description: "Updating users",
    });

    try {
      const { data, status } = await patchRequest<TUser[]>({
        endpoint: "/users",
        payload,
      });

      if (status !== 200) throw data.data.error;

      toast({
        description: message || "User created successfully",
      });
      return data;
    } catch (error) {
      setError(true);
      toast({
        description: "something went wrong, try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateUsers, isLoading, error };
};

type TUserReferrals = Pick<TUser, "created_at" | "firstName" | "lastName">;

export const useGetUserReferrals = ({
  userId,
  referredBy,
}: {
  userId: string;
  referredBy: string;
}): UseGetResult<TUserReferrals[], "userReferrals", "getUserReferrals"> => {
  const [userReferrals, setUserReferrals] = useState<TUserReferrals[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getUserReferrals = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TUserReferrals[]>({
        endpoint: `/users/${userId}/referrals?referredBy=${referredBy}`,
      });

      if (status !== 200) {
        throw data;
      }
      setUserReferrals(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserReferrals();
  }, []);

  return {
    userReferrals,
    isLoading,
    error,
    getUserReferrals,
  };
};
