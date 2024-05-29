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
  const [showMore, setShowMore] = useState(false);

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

  //see more function
  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  useEffect(() => {
    fetchBlogPost();
  }, [blogData]);

  return (
    <>
      <div className="my-[48px] lg:my-[80px]">
        {blogData && blogData.length > 0 && (
          <div className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[52px] lg:mt-[100px]">
            {blogData?.length &&
              blogData?.map((blogPost, i) => (
                <BlogPost
                  key={i}
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
        )}

        {blogData && blogData.length > 10 && !showMore && (
          <div className=" flex justify-center items-center ">
            <button
              onClick={handleSeeMoreClick}
              className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
            >
              See more
            </button>
          </div>
        )}
      </div>
    </>
  );
}
