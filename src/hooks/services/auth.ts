"use client";

import { loginSchema, onboardingSchema } from "@/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getRequest } from "@/utils/api";
import { TAuthUser } from "@/types";
import useOrganizationStore from "@/store/globalOrganizationStore";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";

const supabase = createClientComponentClient();
export const saveCookie = (name: string, value: any) => {
  if (typeof value !== "string") {
    const newValue = JSON.stringify(value);
    Cookies.set(name, newValue);
  } else {
    Cookies.set(name, value);
  }
};

export const getCookie = <T = any>(name: string): T | undefined => {
  let value: T | undefined;

  try {
    const jsonString = Cookies.get(name);
    if (typeof jsonString === "string") {
      value = JSON.parse(jsonString) as T;
    }
  } catch (error) {
    console.error("Error parsing cookie:", error);
  }

  return value;
};

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function registration(
    values: z.infer<typeof onboardingSchema>,
    email: string | null,
    createdAt: string | null
  ) {
    setLoading(true);

    try {
      const { error, status, data } = await supabase.from("users").upsert([
        {
          ...values,
          userEmail: email,
          created_at: createdAt,
        },
      ]);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        await getUser(email);
        setLoading(false);
        toast.success("Profile Updated Successfully");
        router.push("/home");
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

  async function logIn(
    values: z.infer<typeof loginSchema>,
    redirectTo: string | null
  ) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error?.message);

        setLoading(false);
        return;
      }

      if (data && data?.user?.email) {
        await getUser(data?.user?.email);
        //  toast.success("Sign In Successful");
        router.push(redirectTo ?? "home");
        setLoading(false);
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
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // using this to redirect new users to onboarding
  // before modiifcation from the TL

  useEffect(() => {
    async function verifyUser() {
      //  console.log({user})
      if (!user?.userEmail) {
        router.push("/login");
      }
    }

    verifyUser();
  }, []);
}

export const getUser = async (email: string | null) => {
  const { setUser } = useUserStore();

  if (!email) return;
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("userEmail", email)
    .single();
  if (error) {
    //  console.log({error});
    window.open(
      `/onboarding?email=${email}&createdAt=${new Date().toISOString()}`,
      "_self"
    );
    return;
  }
  setUser(user);
  return user;
};

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/${
            values?.email
          }/${new Date().toISOString()}`,
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast.success("Registration  Successful");
        router.push(`/verify-email?message=Verify your Email&content= Thank you for signing up! An email has been sent to your registered
        email address. Please check your inbox and follow the instructions to
        verify your account.&email=${values.email}&redirect=${
          process.env.NEXT_PUBLIC_SITE_URL
        }/auth/callback/${values?.email}/${new Date().toISOString()}`);
      }
    } catch (error) {
      setLoading(false);
    }
  }
  return {
    register,
    loading,
  };
}

export function useLogOut() {
  const router = useRouter();
  const { setOrganization } = useOrganizationStore();
  const { setEvent } = useEventStore();
  const { setUser } = useUserStore();

  async function logOut() {
    await supabase.auth.signOut();
    setUser(null);
    setOrganization(null);
    setEvent(null);
    router.push("/");
  }

  return {
    logOut,
  };
}

export function useGetAuthUser() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<TAuthUser | null>(null);

  const getUser = async () => {
    setLoading(true);
    try {
      const { data, status } = await getRequest<TAuthUser>({
        endpoint: `/auth/user`,
      });

      if (status !== 200) {
        throw data;
      }

      setUser(data.data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  return {
    user,
    loading,
  };
}

/*
 await supabase.auth.resetPasswordForEmail('hello@example.com', {
  redirectTo: 'http://example.com/account/update-password',
})


 */

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function forgotPassword(email: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);

        router.push(
          `/verify-email?message=Reset Password&content=If the email you entered is registered, we've sent a password reset link to your inbox. Please check your email and follow the instructions to reset your password.`
        );
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    forgotPassword,
    loading,
  };
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updatePassword(password: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast.success("Password Reset Successfully");
        router.push(`/login`);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    updatePassword,
    loading,
  };
}

export function useResendLink() {
  const [loading, setLoading] = useState(false);

  async function resendLink(email: string, redirect: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirect,
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return {
    resendLink,
    loading,
  };
}
