"use client";
import React, { useEffect, useState } from "react";
import { AdminBlogCalendarIcon } from "@/constants/icons";
import AdminPublishedBlog from "@/components/blog/AdminBlogTemplate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [startDate, setStartDate] = useState<Date | null >(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { name: "Event tips", value: "Event" },
    { name: "Product Updates", value: "Product" },
    { name: "Guides and Tutorial", value: "Guide" },
    { name: "Case Study", value: "Case" },
  ];

  //fetch blog posts
  async function fetchBlogPost() {
    fetch("/api/blog/scheduled", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setBlogData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Function to filter blog posts based on selected date
  // Function to filter blog posts
  const filterBlogPosts = (posts: DBBlogAll[]) => {
    let filteredPosts = posts;
    if (startDate) {
      filteredPosts = filteredPosts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate.toDateString() === startDate.toDateString();
      });
    }
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === selectedCategory
      );
    }
    return filteredPosts;
  };

  useEffect(() => {
    fetchBlogPost();
  }, [blogData]);

  return (
    <div className=" pl-3 lg:pl-10 pr-3 lg:pr-28 pt-16 lg:pt-20 pb-7 lg:pb-10 ">
      {/* Section1 */}
      <section className="">
        <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row gap-x-0 md:gap-x-6 mt-6">
          <div className="flex p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-full lg:w-[180px] items-center justify-between h-[44px] ">
            <DatePicker
              selected={startDate}
              onChange={(date) => date && setStartDate(date)}
              dateFormat="dd/MM/yyyy" // customize date format
              placeholderText="Select a date"
              className="w-full cursor-pointer bg-transparent outline-none "
              icon={<AdminBlogCalendarIcon />}
              onFocus={(e) => (e.target.readOnly = true)}
            />
          </div>

          <select
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
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
                value={category.value}
                className="bg-transparent text-black text-[15px]"
              >
                {" "}
                {category.name}{" "}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* section 2 */}
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[20px] lg:mt-[24px]  bg-white ">
        {blogData &&
          blogData?.length > 0 &&
          filterBlogPosts(blogData)?.map((blogPost, index) => (
            <AdminPublishedBlog
              scheduled={false}
              draft={true}
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
