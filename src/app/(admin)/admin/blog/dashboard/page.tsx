"use client";
import React, { useEffect, useState } from "react";
import {
  AdminBlogPostIcon,
  AdminBlogShareIcon,
  AdminBlogViewIcon,
  SearchIcon,
  AdminBlogCalendarIcon,
} from "@/constants/icons";
import AdminPublishedBlog from "@/components/blog/AdminBlogTemplate";

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
  shares: number;
  tags: [];
  headerImageUrl: string;
};

export default function Create() {
  const [blogData, setBlogData] = useState<DBBlogAll[] | undefined>(undefined);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const [formData, setFormData] = useState({
    category: "",
    searchInput: "",
  });

  const categories = [
    "Event tips",
    "Product Updates",
    "Guides and Tutorial",
    "Case Study",
  ];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  useEffect(() => {
    if (blogData) {
      // Calculate total views
      const totalViews = blogData.reduce((acc, post) => acc + post.views, 0);
      setTotalViews(totalViews);

      // Calculate total shares
      const totalShares = blogData.reduce((acc, post) => acc + post.shares, 0);
      setTotalShares(totalShares);

      // Total number of blog posts
      const totalPosts = blogData.length;
      setTotalPosts(totalPosts);
    }
  }, [blogData]);

  return (
    <div className=" pl-3 lg:pl-10 pr-3 lg:pr-28 pb-7 lg:pb-10  ">
      {/* Header */}
      <div className="flex pt-28 pb-[44px] gap-x-10 overflow-x-auto lg:overflow-x-hidden no-scrollbar">
        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg ">
          <AdminBlogPostIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">{totalPosts}</p>
            <p className="text-base font-normal">Blog Posts</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg ">
          <AdminBlogViewIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">{totalViews}</p>
            <p className="text-base font-normal">Total Visits</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg ">
          <AdminBlogShareIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">{totalShares}</p>
            <p className="text-base font-normal">Share</p>
          </div>
        </div>
      </div>

      {/* Section1 */}
      <section className="mt-4 lg:mt-10 ">
        <p className="font-semibold text-2xl lg:text-3xl text-center lg:text-left gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">
          Published Blog Post
        </p>
        <p className="font-normal text-sm lg:text-xl text-center lg:text-left mt-2">
          View all published blog posts, filter by name, date published and
          category{" "}
        </p>

        <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between gap-x-0 lg:gap-x-10 mt-6">
          <div className=" p-1 border-[1px] border-indigo-600 rounded-xl w-full lg:w-8/12  ">
            <div className="px-3 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl flex items-center h-[34px] ">
              <SearchIcon />
              <input
                type="text"
                value={formData.searchInput}
                name="searchBox"
                id=""
                onChange={handleChange}
                placeholder="search by blog post title"
                className="pl-4 outline-none text-base text-gray-600 bg-transparent h-full w-full"
              />
            </div>
          </div>

          <div className="flex p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-full lg:w-2/12 items-center justify-between h-[44px] ">
            <p>Date Published</p>
            <AdminBlogCalendarIcon />
          </div>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            // required
            className="w-full lg:w-2/12 h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none"
          >
            <option
              disabled
              selected
              value=""
              className="bg-transparent text-gray-400 "
            >
              Select Category
            </option>
            {categories.map((category, index) => (
              <option
                key={index}
                value={category}
                className="bg-transparent text-black text-[15px]"
              >
                {" "}
                {category}{" "}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* section 2 */}
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] 2xl:max-w-auto mx-auto mt-[52px] lg:mt-[100px] bg-white">
        {blogData &&
          blogData?.length > 0 &&
          blogData?.map((blogPost, index) => (
            <AdminPublishedBlog
              scheduled={false}
              draft={false}
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
      </section>
    </div>
  );
}
