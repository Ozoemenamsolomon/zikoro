import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  shares: number;
  tags: [];
  headerImageUrl: string;
};

export function useFetchBlogTags() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DBBlogPost[]>([]);
  
    useEffect(() => {
      fetchBlogTags();
    }, []);
  
    async function fetchBlogTags() {
      try {
        // Fetch the event by ID
        const { data, error: fetchError } = await supabase
          .from("blogTag")
          .select("*");
  
        if (fetchError) {
          toast.error(fetchError.message);
          return null;
        }
        setData(data);
      } catch (error) {
        return null;
      }
    }
    return {
      data,
      refetch: fetchBlogTags,
    };
  }