"use client";

import { loginSchema, registrationSchema } from "@/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { getUser } from "../../actions/users";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { useUser } from "@auth0/nextjs-auth0/client";

const supabase = createClientComponentClient();
export const saveCookie = (name: string, value: any) => {
  if (typeof value !== "string") {
    const newVale = JSON.stringify(value);
    Cookies.set(name, newVale);
  } else {
    Cookies.set(name, value);
  }
};

export const getCookie = (name: string) => {
  let value;
  const jsonString = Cookies.get(name);

  try {
    if (typeof jsonString === "string") {
      const jsonObject = JSON.parse(jsonString);
      value = jsonObject;
    }
  } catch (error) {
    value = jsonString;
  }

  return value;
};

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function registration(
    values: z.infer<typeof registrationSchema>,
    user: UserProfile | undefined
  ) {
    setLoading(true);
    try {
      const { error, status } = await supabase.from("users").upsert([
        {
          ...values,
          userEmail: user?.email,
          created_at: user?.updated_at,
        },
      ]);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        setLoading(false);
        router.push("/auth/login");
        toast.success("Profile Updated successfully");
      }
    } catch (error) {}
  }
  return {
    registration,
    loading,
  };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function logIn(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
      //  saveCookie("user", data);
        toast.success("Sign In Successful");
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
    }
  }
  return {
    logIn,
    loading,
  };
}

export function useValidateUser() {
  const { user, error } = useUser();

  // using this to redirect new users to onboarding
  // before modiifcation from the TL

  useEffect(() => {
    async function verifyUser() {
      console.log({user})
      if (user && user?.isFirstLogin) {
        redirect("/onboarding");
      } else if (user?.email) {
        const userDetails = await getUser(user.email);
        saveCookie("user", userDetails);
      }
    }

    verifyUser();
  }, [user]);
}