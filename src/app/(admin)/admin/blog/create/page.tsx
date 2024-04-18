"use client";
import React, { useState } from "react";
import TextEditor from "@/components/TextEditor";
import { useForm } from "react-hook-form";
import { UploadIcon } from "@/constants/icons";
import { getCookie } from "@/hooks";
import { toast } from "@/components/ui/use-toast";

export default function Create() {
  const form = useForm<any>({});
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const [searchBox, setSearchBox] = useState("");
  const content = watch("content");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    content: null,
    headerImageUrl: "",
  });

  const setMessage = (content: string) => {
    setValue("content", content);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function goToDashboard() {
    window.open("/admin/blog/dashboard", "_self");
  }

  const submitBlogPost = async (e: any) => {
    e.preventDefault();
    const blogContent = content;
    const blogTitle = searchBox;
    const user = getCookie("user");

    try {
      const response = await fetch("/api/blog/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogContent: blogContent,
          blogTitle: blogTitle,
        }),
      });

      if (response.ok) {
        toast({ variant: "destructive", description: "Post Uploaded" });
        goToDashboard();
      } else {
        throw new Error("Message Not Sent ");
      }
    } catch (error) {
      toast({ variant: "destructive", description: `${error}` });
      console.log(`Error submitting blog ${error}`);
    }
  };

  const categories = [
    "Conferences",
    "Tradeshows & Exhibitions",
    "Seminars & Workshops",
    "Careers",
    "Education",
    "Culture & Arts",
    "Celebrations",
    "Celebrations",
    "Sports",
    "Job Fairs",
    "Festivals",
    "Charity",
  ];

  return (
    <div className="">
      <div className=" flex flex-col pl-3 lg:pl-10 pr-3 lg:pr-28 pt-28 ">
        <p className="text-2xl lg:text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text ">
          Create New Blog Post
        </p>

        <section className="mt-4 lg:mt-6 ">
          <form onSubmit={submitBlogPost}>
            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center">
              <div className=" rounded-xl shadow-sm w-full lg:w-[620px]  ">
                {/* 570 width */}
                <div className="px-3 bg-transparent rounded-xl flex items-center ">
                  <input
                    type="text"
                    value={searchBox}
                    name="searchBox"
                    id=""
                    onChange={handleChange}
                    placeholder="Enter Blog Title"
                    className="pl-4 outline-none text-2xl text-gray-600 bg-transparent h-[44px] w-full"
                    required
                  />
                </div>
              </div>

              <select
                name="industry"
                // onChange={handleChange}
                value=""
                id=""
                className="w-full lg:w-[180px] h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none"
              >
                <option
                  disabled
                  selected
                  value={formData.category}
                  className="bg-transparent text-gray-400 "
                >
                  Select Category
                </option>
                {categories.map((category) => (
                  <option
                    value={category}
                    className="bg-transparent text-black text-[15px]"
                  >
                    {" "}
                    {category}{" "}
                  </option>
                ))}
              </select>

              <select
                name="industry"
                // onChange={handleChange}
                value=""
                id=""
                className="w-full lg:w-[180px] h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none"
              >
                <option disabled selected value="" className="">
                  Add Tags
                </option>

                <option
                  value="Conferences"
                  className="bg-transparent text-black"
                >
                  Conferences
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center">
              <div className=" rounded-xl w-full lg:w-[300px]  ">
                {/* 570 width */}
                <div className="px-0 lg:px-3 bg-transparent rounded-xl ">
                  <input
                    type="file"
                    id=""
                    className="pl-4 outline-none text-sm text-gray-600 bg-transparent h-[44px] w-full"
                    required
                  />
                </div>
              </div>

              <div className=" cursor-pointer flex gap-x-5 lg:gap-x-2 items-center">
                <p className="text-sm">Upload Post Image</p>
                <UploadIcon />
              </div>

              <button
                className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-[1px] border-indigo-600 font-medium text-[15px] w-full lg:w-[180px] h-[44px] rounded-lg"
                type="submit"
              >
                Save to draft
              </button>

              <button
                className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-[1px] border-indigo-600 font-medium text-[15px]  w-full lg:w-[180px] h-[44px] rounded-lg"
                type="submit"
              >
                Preview
              </button>

              <button
                className="text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end w-full lg:w-[180px] h-[44px] rounded-lg font-medium text-[15px]"
                type="submit"
              >
                Publish
              </button>
            </div>

            <div className="mt-8 lg:mt-[60px] bg-white flex-1 resize-none h-fit mb-10 ">
              <TextEditor
                onChange={setMessage}
                defaultValue={content}
                placeholder="Write Your Blog Content Here"
                isBlog
              />
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
