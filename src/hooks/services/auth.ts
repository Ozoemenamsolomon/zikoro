"use client";

import { loginSchema, onboardingSchema } from "@/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TUser } from "@/types/user";
import { getRequest } from "@/utils/api";

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
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (status === 201 || (status === 200 && email && email !== null)) {
        await getUser(email);
        setLoading(false);
        toast({ description: "Profile Updated Successfully" });
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

  async function logIn(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        //  console.log("error", error?.status)
        if (error?.status === 400) {
          toast({
            variant: "destructive",
            description: "Invalid Login Credentials",
          });
        }
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (data && data?.user?.email) {
        await getUser(data?.user?.email);
       // console.log("user", data?.user?.email);
        //  saveCookie("user", data);
        toast({ description: "Sign In Successful" });
        // router.back();
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
  const user = getCookie("user");
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

export const getUser = async (email: string) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("userEmail", email)
    .single();
  if (error) {
    //  console.log({error});
  }
  saveCookie("user", user);
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
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        //  console.log("error", error?.status)

        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (data && data?.user) {
        //  saveCookie("user", data);
        toast({ description: "Regsitration  Successful" });
        router.push(
          `/onboarding?email=${data?.user?.email}&createdAt=${data?.user?.created_at}`
        );
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


export async function useLogOut() {
  const router = useRouter()
  async function logOut() {
    await supabase.auth.signOut()
    saveCookie("user", null)
    router.push("/")
  }
  

return {
  logOut
}
}