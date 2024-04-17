import { useState, useEffect, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
  };

export function useFetchBlogPost(id: string) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DBBlogPost | null>(null);
  
    useEffect(() => {
      fetchSingleEvent();
    }, []);
  
    async function fetchSingleEvent() {
      try {
        setLoading(true);
        // Fetch the event by ID
        const { data, error: fetchError } = await supabase
          .from("blog")
          .select("*")
          .eq("id", id)
          .single();
  
        if (fetchError) {
          toast({ variant: "destructive", description: fetchError.message });
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
      refetch: fetchSingleEvent,
    };
  }