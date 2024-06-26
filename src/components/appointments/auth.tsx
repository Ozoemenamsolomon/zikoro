import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const fetchUser = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Error fetching authenticated user:", authError);
      return null;
    }

    if (authData) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("userEmail", authData.user?.email)
        .single();

      if (userError) {
        console.error("Error fetching user details:", userError);
        return null;
      }

      return user;
    }
    return null;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
};
