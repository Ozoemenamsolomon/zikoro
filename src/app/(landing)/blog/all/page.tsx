"use client";
import React, { useEffect, useState } from "react";
import BlogPost from "@/components/blog/BlogPost";

type DBBlogAll = {
  id: number;
  title: string;
  created_at: string;
  category: string;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: JSON;
  views: number;
  shares: JSON;
  tags: [];
  headerImageUrl: string;
};

export default function All() {
  const [blogData, setBlogData] = useState<DBBlogAll[] | undefined>(undefined);

  //fetch blog posts
  async function fetchBlogPost() {
    fetch("/api/blog/published", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setBlogData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    fetchBlogPost();
  }, [blogData]);

  return (
    <div>
      <div className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[52px] lg:mt-[100px]">
        {blogData?.length &&
          blogData?.map((blogPost, index) => (
            <BlogPost
              key={blogPost.id}
              id={blogPost.id}
              title={blogPost.title}
              createdAt={blogPost.created_at}
              category={blogPost.category}
              status={blogPost.status}
              statusDetails={blogPost.statusDetails}
              readingDuration={blogPost.readingDuration}
              content={blogPost.content}
              views={blogPost.views}
              shares={blogPost.shares}
              tags={blogPost.tags}
              headerImageUrl={blogPost.headerImageUrl}
            />
          ))}
      </div>

      <div className=" flex justify-center items-center my-[48px] lg:my-[80px]">
        <button className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white">
          See more
        </button>
      </div>
    </div>
  );
}
