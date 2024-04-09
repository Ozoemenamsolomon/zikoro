"use server";
// TODO: install and use supabase
// import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const getUser = async (email: string) => {

  console.log("email", email)
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("userEmail", email)
    .single();
  if (error) {
    console.log({ error });
  }
  return user;
};
