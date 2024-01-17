"use client";

import { loginSchema, registrationSchema } from "@/validations";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  async function registration(values: z.infer<typeof registrationSchema>) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.userEmail,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log();
        const { password, ...restDatas } = values;
        let created_at;
        if (data?.user?.identities) {
          created_at = data?.user?.identities[0]?.created_at;
          console.log(data?.user?.identities[0]?.created_at);
        }
        // Store user data in a 'users' table
        const { error, status } = await supabase
          .from("users")
          .upsert({ userId: data?.user.id, created_at, ...restDatas });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }
        if (status === 201)
          toast.success("Sign Up successful, Verify your mail to continue");
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
  const supabase = createClientComponentClient();

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
