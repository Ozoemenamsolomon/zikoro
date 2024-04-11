"use client";

import { loginSchema, registrationSchema } from "@/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getRequest } from "@/utils/api";
import { TAuthUser } from "@/types";

const supabase = createClientComponentClient();
export const saveCookie = (name: string, value: any) => {
  if (typeof value !== "string") {
    const newValue = JSON.stringify(value);
    Cookies.set(name, newValue);
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
        toast({variant:"destructive",description:error.message});
        setLoading(false);
        return;
      }

      if (status === 201 || status === 200) {
        await getUser(email);
        setLoading(false);
        toast({description:"Profile Updated successfully"});
        router.back();
        
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
        // if (error?.message) toast({ variant: "destructive", description: error?.message });
        alert(error?.message);

        setLoading(false);
        return;
      }

      if (data && data?.user?.email) {
        await getUser(data?.user?.email);
        toast({ description: "Sign In Successful" });
        router.push("/home");
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
  const { user, error } = useUser();
  const router = useRouter()

  // using this to redirect new users to onboarding
  // before modiifcation from the TL

  useEffect(() => {
    async function verifyUser() {
      console.log({user})
      if (user && user?.isFirstLogin && user?.email) {
        const userDetails = await getUser(user.email);
        saveCookie("user", userDetails);
     //   router.push("/onboarding");
      } else if (user?.email) {
        const userDetails = await getUser(user.email);
        saveCookie("user", userDetails);
      }
    }

    verifyUser();
  }, [user]);
}


export const getUser = async (email: string | null) => {
  if (!email) return;
  const { data: user, error } = await supabase
  .from("users")
    .select("*")
    .eq("userEmail", email)
    .single();
  if (error) {
  //  console.log({error});
  }
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
          emailRedirectTo: `${location.origin}/auth/callback/${values?.email}/${new Date().toISOString()}`,
        },
      });

      if (error) {
        alert(error.message);
        toast({ variant: "destructive", description: error.message });
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast({ description: "Regsitration  Successful" });
        router.push("/verify-email");
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

  async function logOut() {
    await supabase.auth.signOut();
    saveCookie("user", null);
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
