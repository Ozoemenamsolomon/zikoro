"use server";

import { supabaseClient } from "@/lib/supabase";

export const getUser = async (email: string) => {
  const { data: user, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("userEmail", email)
    .single();
  if (error) {
    console.log({ error });
  }
  return user;
};
