// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// const supabase = createClientComponentClient();

// export const fetchUser = async () => {

//     const response= supabase.auth.getUser()
//     console.log({res: await response.json()})

//     // if (!email) return;
//     // const { data: user, error } = await supabase
//     //   .from("users")
//     //   .select("*")
//     //   .eq("userEmail", email)
//     //   .single();
//     // if (error) {
//     //   //  console.log({error});
//     //   window.open(
//     //     `/onboarding?email=${email}&createdAt=${new Date().toISOString()}`,
//     //     "_self"
//     //   );
//     //   return;
//     // }
//     // // console.log(user);
//     // // saveCookie("user", user);
//     // return user;
//   };
  import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const fetchUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    
    console.log({ res: data });
    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
};
