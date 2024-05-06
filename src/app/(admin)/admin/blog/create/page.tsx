"use client";
import React, { useState } from "react";
import TextEditor from "@/components/TextEditor";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { AddTag } from "@/components/blog/modal/AddTag";

export default function Create() {
  const form = useForm<any>({
    // Add validation rule for content field
    criteriaMode: "all",
    defaultValues: {
      content: "", // Set default value for content
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const content = watch("content");

  const [formData, setFormData] = useState<any>({
    title: "",
    category: "",
    tags: [],
    content: [],
    readingDuration: "",
    statusDetail: {},
  });
  const [file, setFile] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);

  const categories = [
    { name: "Event tips", value: "event" },
    { name: "Product Updates", value: "product" },
    { name: "Guides and Tutorial", value: "guide" },
    { name: "Case Study", value: "case" },
  ];

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

  const handleUpdateStaus = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleImageChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const addNewTags = (tags: string[]) => {
    setFormData({ ...formData, tags });
    setTagModalOpen(false);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "w5xbik6z");
    formData.append("folder", "ZIKORO");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/zikoro/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Image Uploaded");
        return data.url; // Return the uploaded image URL
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      toast.error(`Error uploading image: ${error}`);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  const preview = () => {
    alert("emma");
  };

  const submitBlogPost = async (e: any) => {
    e.preventDefault();
    if (!content) {
      toast.error("Please write your blog content");
      return;
    }

    if (!content) {
      toast.error("Please write your blog content");
      return; // Return early if content is empty
    }

    // Upload image
    uploadImage()
      .then((headerImageUrl) => {
        // Fetch request
        return fetch("/api/blog/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            headerImageUrl: headerImageUrl, // Use uploaded image URL
            tags: formData.tags,
            readingDuration: formData.readingDuration,
            status: status,
            content: content,
          }),
        });
      })
      .then((response) => {
        if (response.ok) {
          toast.success(
            `${status === "draft" ? "Saved to draft" : "Post Published"}`
          );
          goToDashboard();
        } else {
          throw new Error("Post Not Published ");
        }
      })
      .catch((error) => {
        toast.error(`${error}`);
        console.log(`Error submitting blog ${error}`);
      });
  };

  return (
    <div className="">
      <div className=" flex flex-col pl-3 lg:pl-10 pr-3 lg:pr-28 pt-28 ">
        <p className="text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text ">
          Create New Blog Post
        </p>

        <section className="mt-4 lg:mt-6 ">
          <form onSubmit={submitBlogPost}>
            <input type="hidden" name="status" value={status} />
            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
              <div className=" rounded-xl shadow-sm w-full lg:w-8/12  ">
                <div className="px-3 bg-transparent rounded-xl flex items-center ">
                  <input
                    type="text"
                    value={formData.title}
                    name="title"
                    onChange={handleChange}
                    placeholder="Enter Blog Title"
                    className="pl-4 outline-none text-2xl text-gray-600 bg-transparent h-[44px] w-full"
                    required
                  />
                </div>
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full lg:w-2/12 h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none  hover:text-gray-50 hover:bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end cursor-pointer"
              >
                <option
                  disabled
                  defaultValue=""
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

              <div
                onClick={() => setTagModalOpen(true)}
                className=" flex items-center px-4 rounded-lg h-[44px] border-[1px] border-indigo-600 hover:text-gray-50 hover:bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gap-x-2 w-full lg:w-2/12 text-[15px] font-medium cursor-pointer"
              >
                <PlusCircle size={22} />
                <p>Tag</p>
              </div>
            </div>
            {/* second section */}
            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
              <div className="px-0 lg:px-3 bg-transparent rounded-xl shadow-sm  w-full lg:w-4/12 items-center justify-center ">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className=" pt-3 outline-none text-base text-gray-600 bg-transparent h-[44px] w-full"
                  required
                />
              </div>

              <div className="px-0 lg:px-3 bg-transparent shadow-sm  rounded-xl w-full lg:w-2/12">
                <input
                  type="text"
                  name="readingDuration"
                  onChange={handleChange}
                  placeholder="Reading Duration"
                  className=" pl-4 outline-none text-base text-gray-600 bg-transparent h-[44px] w-full"
                  value={formData.readingDuration}
                  required
                />
              </div>

              <button
                onClick={() => handleUpdateStaus("draft")}
                className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-[1px] border-indigo-600 font-medium text-[15px] w-full lg:w-2/12 h-[44px] rounded-lg"
                type="submit"
              >
                Save to draft
              </button>

              <button
                disabled
                className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-[1px] border-indigo-600 font-medium text-[15px]  w-full lg:w-2/12 h-[44px] rounded-lg cursor-pointer"
                onClick={preview}
              >
                Preview
              </button>

              <button
                onClick={() => handleUpdateStaus("publish")}
                className="text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end w-full lg:w-2/12 h-[44px] rounded-lg font-medium text-[15px] cursor-pointer"
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
      {tagModalOpen && <AddTag updateTags={addNewTags} />}
    </div>
  );
}
