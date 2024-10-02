"use client";
import React, { useEffect, useState } from "react";
import { AdminBlogCalendarIcon } from "@/constants/icons";
import AdminPublishedBlog from "@/components/blog/AdminBlogTemplate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface Category {
  name: string;
  value: string;
}

export default function BlogDraft() {
  const [blogData, setBlogData] = useState<DBBlogAll[] | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [checkedItems, setCheckedItems] = useState<Category[]>([]);

  //handle checkbox selection
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: Category
  ) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setCheckedItems((prevCheckedItems) => [...prevCheckedItems, category]);
    } else {
      setCheckedItems((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item.value !== category.value)
      );
    }
  };

  //fetch blog posts
  async function fetchDraftPost() {
    fetch("/api/blog/drafts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setBlogData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  //handle date selection
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
    checkedItems: Category[] | null
  ) => {
    let filteredPosts = posts;

    if (checkedItems) {
      const selectedCategories = checkedItems.map((item) => item.value);
      if (selectedCategories.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
          selectedCategories.includes(post.category)
        );
      }
    }

    if (startDate && endDate) {
      filteredPosts = filteredPosts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= startDate && postDate <= endDate;
      });
    }

    return filteredPosts;
  };

  //fetch blog post
  useEffect(() => {
    fetchDraftPost();
  }, []);

  return (
    <div className=" pl-3 lg:pl-10 pr-3 lg:pr-28 pt-16 lg:pt-20 pb-7 lg:pb-10  ">
      {/* Section1 */}
      <section className="">
        <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row gap-x-0 md:gap-x-6 mt-6">
          <div className="flex cursor-pointer p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-full lg:w-2/12 items-center justify-between h-[44px] ">
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable
              locale="en-GB"
              showPopperArrow={false}
              popperPlacement="top-start"
              icon={<AdminBlogCalendarIcon />}
              className="w-full cursor-pointer text-indigo-600 bg-transparent outline-none"
              placeholderText="Select Your Dates "
              onFocus={(e) => (e.target.readOnly = true)}
            />
          </div>

          <Popover>
            <PopoverTrigger className="w-full lg:w-2/12 h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none">
              Select Category
            </PopoverTrigger>
            <PopoverContent className="p-3 bg-white shadow-lg rounded-lg">
              <form>
                {[
                  { name: "Event tips", value: "Event" },
                  { name: "Product Updates", value: "Product" },
                  { name: "Guides and Tutorial", value: "guide" },
                  { name: "Case Study", value: "Case" },
                ].map((category, index) => (
                  <div className="flex items-center mb-2" key={index}>
                    <input
                      id={`checkbox${index + 1}`}
                      type="checkbox"
                      className="mr-2"
                      checked={checkedItems.some(
                        (item) => item.value === category.value
                      )}
                      onChange={(e) => handleCheckboxChange(e, category)}
                    />
                    <label
                      htmlFor={`checkbox${index + 1}`}
                      className="text-[15px]"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* section 2 */}
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[20px] lg:mt-[24px]  bg-white ">
        {blogData && (
          <>
            {filterBlogPosts(blogData, startDate, endDate, checkedItems)?.map(
              (blogPost, index) => (
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
              )
            )}
          </>
        )}
      </section>
    </div>
  );
}
