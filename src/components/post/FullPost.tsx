"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Facebook, X, Linkedin, Instagram } from "@/constants/icons";
import PostArticle from "@/components/blog/PostArticle";
import { useFetchBlogPost } from "@/hooks/services/post";

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
  tags: [];
  headerImageUrl: string;
};

export default function FullPost({ postId }: { postId: string }): JSX.Element {
  const {
    data,
    refetch,
  }: {
    data: DBBlogPost | null;
    loading: boolean;
    refetch: () => Promise<null | undefined>;
  } = useFetchBlogPost(postId);

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: any): any {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      const formattedDate: string = formatDate(date);
      return formattedDate;
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }

  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Month is zero-based, so add 1
    const day: number = date.getDate();

    const monthNames: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedDate: string = `${day} ${monthNames[month - 1]} ${year}`;
    return formattedDate;
  }

  return (
    <div className="mt-[120px] lg:mt-[200px] px-3 lg:px-0 ">
      {/* header section */}
      <div className="mzx-w-full lg:max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
        <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-4 text-center ">
          <p className="text-indigo-600 text-[12px] lg:text-[15px] font-medium">
            Blog Category
          </p>
          <p className="capitalize text-2xl font-semibold lg:text-4xl ">
            {data?.title}
          </p>
          <p className="uppercase text-gray-400">
            {extractAndFormatDate(data?.created_at)} - <span>3 mins read </span>
          </p>
        </div>
        <Image
          src={data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"}
          alt=""
          width={982}
          height={450}
          className="w-[982px] h-[450px] object-cover hidden lg:block"
        />
          <Image
          src={data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"}
          alt=""
          width={335}
          height={160}
          className="w-full h-[160px] object-cover block lg:hidden"
        />
      </div>

      {/* body section */}
      <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-28 lg:mb-20 ">
        {/* Left */}
        <div className="hidden lg:inline h-full pb-12 w-full flex-col  lg:w-3/12">
          {/* section links */}
          <div className="flex-col">
            {/* Top */}
            <p className="text-xl font-semibold">On This Page</p>
            {/* Links */}
            <p className="text-base font-normal mt-8">
              Lorem ipsum dolor sit amet consectetur. Vitae sollicitudin tellus{" "}
            </p>

            <p className="text-base font-normal mt-8">
              Lorem ipsum dolor sit amet consectetur. Vitae sollicitudin tellus{" "}
            </p>
          </div>

          {/* Share Buttons */}
          <div className="mt-8">
            <p className="text-xl font-medium">Share This Article</p>
            <div className="flex gap-x-[14px] mt-4">
              <X />
              <Facebook />
              <Instagram />
              <Linkedin />
            </div>
          </div>
        </div>

        <div className=" h-full lg:h-auto w-full lg:w-9/12  flex-col  pb-0 lg:pb-[50px]">
          <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t-0 lg:border-t-[1px] border-gray-300 mb-12 lg:mb-24 mt-44">
        <p className="text-center text-xl lg:text-3xl font-semibold mt-14">
          Read More Articles
        </p>
        <div className="flex flex-col lg:flex-row  px-0 lg:px-[146px] gap-x-0 lg:gap-x-[100px] gap-y-7 lg:gap-y-0 py-7 lg:py-16">
          <PostArticle />
          <PostArticle />
        </div>
      </div>
    </div>
  );
}