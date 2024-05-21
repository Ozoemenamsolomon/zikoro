"use client";
import React, { useEffect, useState } from "react";
import TextEditor from "@/components/TextEditor";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { AddTag } from "@/components/blog/modal/AddTag";
import { useRouter } from "next/navigation";
import { useFetchBlogPost } from "@/hooks/services/post";
import Image from "next/image";

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
  tags: string[];
  headerImageUrl: string;
};

export default function EditPost({ postId }: { postId: string }): JSX.Element {
  const { data, refetch } = useFetchBlogPost(postId);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    criteriaMode: "all",
    mode: "onChange",
  });

  const content = watch("content");

  const [formData, setFormData] = useState<any>({
    title: "",
    category: "",
    tags: [],
    readingDuration: "",
    statusDetail: {},
  });

  const categories = [
    { name: "Event tips", value: "event" },
    { name: "Product Updates", value: "product" },
    { name: "Guides and Tutorial", value: "guide" },
    { name: "Case Study", value: "case" },
  ];

  const setMessage = (content: string) => {
    setValue("content", content);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const addNewTags = (tags: string[]) => {
    setFormData((prevData: any) => ({ ...prevData, tags }));
    setTagModalOpen(false);
  };

  //upload Image
  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;

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

      const responseBody = await res.json();

      if (res.ok) {
        toast.success("Image Uploaded");
        return responseBody.url;
      } else {
        console.error("Image upload response:", responseBody);
        throw new Error(responseBody.error?.message || "Image upload failed");
      }
    } catch (error) {
      toast.error(`Error uploading image: ${error}`);
      console.error("Error during image upload:", error);
      return null;
    }
  };

  const preview = async () => {
    alert("still working on this");
  };

  const saveOrPublish = async (formData: any) => {
    const headerImageUrl = file ? await uploadImage() : data?.headerImageUrl;

    try {
      const response = await fetch("/api/blog/drafts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          ...formData,
          headerImageUrl,
          status,
          content,
        }),
      });

      if (response.ok) {
        toast.success(
          `${status === "draft" ? "Saved to draft" : "Post Published"}`
        );
        if (status !== "draft" && status !== "schedule") {
          router.push("/admin/blog/dashboard");
        }
      } else {
        throw new Error("Post Not Saved");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        content: data?.content,
        title: data?.title,
        category: data?.category,
        readingDuration: data?.readingDuration,
        tags: data?.tags,
      });
      setFormData({
        title: data?.title,
        category: data?.category,
        tags: data?.tags,
        readingDuration: data?.readingDuration,
        statusDetail: data?.statusDetails,
      });
      setStatus(data?.status);
    }
  }, [data]);

  return (
    <div className="lg:max-w-[1180px] mx-auto">
      <div className="flex flex-col pl-3 lg:pl-10 pr-3 lg:pr-12 pt-28">
        <p className="text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text pl-3">
          Edit Blog Post
        </p>

        <section className="mt-4 lg:mt-6">
          <form onSubmit={handleSubmit(saveOrPublish)}>
            <input type="hidden" name="status" value={status} />
            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
              <div className="rounded-xl shadow-sm w-full lg:w-8/12">
                <div className="px-3 bg-transparent rounded-xl flex items-center">
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    onChange={handleChange}
                    placeholder="Enter Blog Title"
                    className="pl-4 outline-none text-2xl text-gray-600 bg-transparent h-[44px] w-full"
                    required
                  />
                </div>
              </div>

              <select
                {...register("category", { required: true })}
                onChange={handleChange}
                required
                className="w-full lg:w-2/12 h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none hover:text-gray-50 hover:bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end cursor-pointer"
              >
                {categories.map((category, index) => (
                  <option
                    key={index}
                    value={category.value}
                    className="bg-transparent text-black text-[15px]"
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <div
                onClick={() => setTagModalOpen(true)}
                className="flex items-center px-4 rounded-lg h-[44px] border-[1px] border-indigo-600 hover:text-gray-50 hover:bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gap-x-2 w-full lg:w-2/12 text-[15px] font-medium cursor-pointer"
              >
                <PlusCircle size={22} />
                <p>Tag</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
              <div className="px-0 lg:px-3 bg-transparent rounded-xl shadow-sm w-full lg:w-2/12 items-center justify-center">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="pt-3 outline-none text-base text-gray-600 bg-transparent h-[44px] w-full"
                />
              </div>
              {data?.headerImageUrl && (
                <Image
                  src={data.headerImageUrl}
                  alt="Header Image"
                  height={90}
                  width={90}
                  className="object-contain w-[90px] h-[90px] max-w-full lg:max-w-2/12"
                />
              )}

              <div className="px-3 bg-transparent rounded-xl shadow-sm w-full lg:w-2/12 items-center justify-center">
                <input
                  type="text"
                  {...register("readingDuration", { required: true })}
                  defaultValue={data?.readingDuration}
                  name="readingDuration"
                  onChange={handleChange}
                  placeholder="Enter Reading Duration"
                  className="pl-4 outline-none text-base text-gray-600 bg-transparent h-[44px] w-full"
                  required
                />
              </div>

              <button
                onClick={() => handleUpdateStatus("draft")}
                className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-[1px] border-indigo-600 font-medium text-[15px] w-full lg:w-2/12 h-[44px] rounded-lg cursor-pointer"
                type="submit"
              >
                Save
              </button>

              <button
                className="gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-[1px] border-indigo-600 font-medium text-[15px] w-full lg:w-2/12 h-[44px] rounded-lg cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  preview();
                }}
              >
                Preview
              </button>

              <button
                onClick={() => handleUpdateStatus("publish")}
                className="text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end w-full lg:w-2/12 h-[44px] rounded-lg font-medium text-[15px] cursor-pointer"
                type="submit"
              >
                Publish
              </button>
            </div>

            <div className="mt-8 lg:mt-[60px] bg-white flex-1 resize-none h-fit mb-10">
              {data && (
                <TextEditor
                  defaultValue={data.content}
                  onChange={setMessage}
                  isBlog
                />
              )}
            </div>
          </form>
        </section>
      </div>
      {tagModalOpen && <AddTag updateTags={addNewTags} />}
    </div>
  );
}
