import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

type DBBlogPost = {
  id: number;
  title: string;
  created_at: string;
  category: string;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: string;
  views: number;
  shares: JSON;
  tags: [];
  headerImageUrl: string;
};


export function useFetchBlogPost(id: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DBBlogPost | null>(null);

  useEffect(() => {
    fetchBlogPost();
  }, []);

  async function fetchBlogPost() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast.error(fetchError.message);
        setLoading(false);
        return null;
      }

      setLoading(false);
      setData(data);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }

  return {
    data,
    loading,
    refetch: fetchBlogPost,
  };
}


// export function useFetchBlogTags() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<DBBlogPost | null>(null);

//   useEffect(() => {
//     fetchBlogTags();
//   }, []);

//   async function fetchBlogTags() {
//     try {
//       setLoading(true);
//       // Fetch the event by ID
//       const { data, error: fetchError } = await supabase
//         .from("blogTag")
//         .select("*")
//         .maybeSingle();

//       if (fetchError) {
//         toast.error(fetchError.message);
//         setLoading(false);
//         return null;
//       }

//       setLoading(false);
//       setData(data);
//     } catch (error) {
//       setLoading(false);
//       return null;
//     }
//   }

//   return {
//     data,
//     loading,
//     refetch: fetchBlogTags,
//   };
// }

