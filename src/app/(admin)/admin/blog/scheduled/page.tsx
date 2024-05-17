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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const handleDateChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // Function to filter blog posts based on selected date and other criteria
  const filterBlogPosts = (
    posts: DBBlogAll[],
    startDate: Date | null,
    endDate: Date | null,
    selectedCategory: string | null
  ) => {
    let filteredPosts = posts;

    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (startDate && endDate) {
      filteredPosts = filteredPosts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= startDate && postDate <= endDate;
      });
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
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable
              showPopperArrow={false}
              popperPlacement="top-start"
              // locale="en-GB"
              icon={<AdminBlogCalendarIcon />}
              className="w-full cursor-pointer text-indigo-600 bg-transparent outline-none"
              placeholderText="Select Your Dates "
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
        {blogData && (
          <>
            {filterBlogPosts(
              blogData,
              startDate,
              endDate,
              selectedCategory
            )?.map((blogPost, index) => (
              <AdminPublishedBlog
                scheduled={true}
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
          </>
        )}
      </section>
    </div>
  );
}
