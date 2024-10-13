import { BookingsContact } from "@/types/appointments";
// import { createClient } from "@/utils/supabase/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface FetchContactsResult {
  data: BookingsContact[] | null;
  error: string | null;
  count: number;
}

export const fetchContacts = async (
  q?: string
): Promise<FetchContactsResult> => {
    // const supabase = createClient()
    const supabase = createRouteHandlerClient({ cookies });
    const  {data:{user}} = await supabase.auth.getUser()
    const {data:userData, error:err} = await supabase.from('users').select('userEmail,id').eq('userEmail', user?.email).single()
  try {
    let query = supabase
      .from('bookingsContact')
      .select('*', { count: 'exact' }) 
      .eq('createdBy', userData?.id)
      .order('firstName', {ascending: false} ); 

    // If 'q' is provided, add additional filtering
    if (q) {
      query = query.eq('category', q); 
    }

    const { data, count, error } = await query;
    // console.error({user, userData, err, data, count, error });

    if (error) {
      console.error('Error fetching contacts:', error);
      return { data: null, error: error.message, count: 0 };
    }

    return { data, error: null, count: count ?? 0 };
  } catch (error) {
    console.error('Server error:', error);
    return { data: null, error: 'Server error', count: 0 };
  }

};
