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

type DBBlogTag = {
  blogTag: string;
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

export function useFetchBlogTags() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DBBlogTag[]>([]);

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

export function useCreateBlogTag() {
  const [loading, setLoading] = useState(false);

  async function createBlogTag(tagName: string) {
    try {
      const { data, error, status } = await supabase
        .from("blogTag")
        .upsert({ blogTag: tagName });

      if (error) {
        toast.error(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Tag created successfully");
      }
    } catch (error) { }
  }

  return {
    createBlogTag,
  };
}

export function useUpdatePostView() {
  async function updatePostView(currentView: number, postId: number) {
    try {
      const { data, error, status } = await supabase
        .from("blog")
        .update(
          {
            views: currentView + 1,
          },
        )
        .eq("id", postId);

      if (error) {
        console.log(error.message);
        return;
      }

      if (status === 204 || status === 200) {
      }
    } catch (error) { }
  }

  return {
    updatePostView,
  };
}

export function useUpdatePostshare() {
  async function updatePostShare(currentShare: number, postId: number) {
    try {
      const { data, error, status } = await supabase
        .from("blog")
        .update(
          {
            shares: currentShare + 1,
          },
        )
        .eq("id", postId);

      if (error) {
        console.log(error.message);
        return;
      }

      if (status === 204 || status === 200) {
        console.log("post view updated");
      }
    } catch (error) { }
  }

  return {
    updatePostShare,
  };
}
