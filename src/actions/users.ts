"use server";
// TODO: install and use supabase
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_KEY
// );

export const getUser = async (email: string) => {
  return {
    id: 1,
    email,
  };
  // const { data: user, error } = await supabase
  //   .from("users")
  //   .select("*")
  //   .eq("userEmail", email)
  //   .single();
  // if (error) {
  //   console.log({error});
  // }
  // return user;

};

