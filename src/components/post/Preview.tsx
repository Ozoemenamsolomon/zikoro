"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  shareOnFacebook,
  shareOnInstagram,
  shareOnLinkedin,
  shareOnTwitter,
} from "@/utils/shareOnSocial";
import { Facebook, X, Linkedin, Instagram } from "@/constants/icons";
import CopyrightFooter from "../CopyrightFooter";
import Link from "next/link";

type BlogPreviewData = {
  title: string;
  category: string;
  tags: string[];
  headerImageUrl: string;
  readingDuration: string;
  status: string;
  content: string;
  created_at: number;
};

export default function Preview(): JSX.Element {
  const [data, setData] = useState<BlogPreviewData | null>(null); // Initialize data as null
  const [loading, setLoading] = useState(true); // Add loading state

  //for side bar links
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  //getting the data from local storage
  useEffect(() => {
    const blogDataString = localStorage.getItem("blogPreviewData");

    if (blogDataString) {
      try {
        const parsedBlogData: BlogPreviewData = JSON.parse(blogDataString);
        setData(parsedBlogData);
        // Optionally, clear the local storage
        localStorage.removeItem("blogPreviewData");
      } catch (error) {
        console.error("Error parsing blog preview data:", error);
      }
    } else {
      console.error("No preview data found");
    }
  }, []);

  // Render error state if data couldn't be loaded
  if (!data) {
    return <div>Loading...</div>;
  }

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: any): any {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        // throw new Error("Invalid date");
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

  //share functionality

  const headings = data?.content.match(/<h[1](.*?)>(.*?)<\/h[1]>/g) || [];

  return (
    <>
      {data && (
        <div className="mt-[120px] lg:mt-[200px] px-3 lg:px-0 ">
          {/* header section */}
          <div className="mzx-w-full lg:max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
            <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-2 text-center ">
              <p className="text-indigo-600 text-[12px] lg:text-[15px] font-medium uppercase">
                {data?.category}
              </p>
              <p className="capitalize text-2xl font-semibold lg:text-4xl ">
                {data?.title}
              </p>
              <p className="uppercase text-gray-400">
                {extractAndFormatDate(data?.created_at)} -{" "}
                <span>{data?.readingDuration} mins read </span>
              </p>
            </div>
            <Image
              src={
                data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
              }
              alt=""
              width={982}
              height={450}
              className="w-[982px] h-[450px] object-cover hidden lg:block"
            />
            <Image
              src={
                data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
              }
              alt=""
              width={335}
              height={160}
              className="w-full h-[160px] object-cover block lg:hidden"
            />
          </div>

          {/* body section */}
          <div
            // ref={existingElement}
            className="w-full h-fit"
          >
            <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-24 lg:mb-24  ">
              {/* Left */}
              <div
                className={`hidden lg:inline sticky top-[120px] transform transition-all duration-200 pb-12 w-full flex-col lg:w-3/12 h-fit`}
                id="left"
              >
                {/* section links */}
                <div className="flex-col border-[1px] border-gray-100 rounded-lg px-3 pt-3">
                  {/* Top */}
                  <p className="text-xl font-semibold">On This Page</p>
                  {/* Links */}
                </div>

                {/* Share Buttons */}
                <div className="mt-8">
                  <p className="text-xl font-medium">Share This Article</p>
                  {/* <div className="flex gap-x-[14px] mt-4">
                    <div
                      className="cursor-pointer"
                      onClick={handleShareOnTwitter}
                    >
                      <X />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={handleShareOnFacebook}
                    >
                      <Facebook />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={handleShareOnInstagram}
                    >
                      <Instagram />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={handleShareOnLinkedin}
                    >
                      <Linkedin />
                    </div>
                  </div> */}
                </div>
              </div>

              <div
                ref={contentRef}
                className={` w-full  flex-col  pb-0 lg:pb-[50px] ${
                  "" ? "lg:ml-[30%] lg:w-9/12 lg:overflow-y-auto" : "lg:w-9/12"
                }`}
                id="right"
              >
                <div
                  className="blog no-scrollbar"
                  dangerouslySetInnerHTML={{ __html: data?.content ?? "" }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-full lg:max-w-6xl mx-auto flex gap-x-4 ">
            <p className="font-bold">Tags:</p>
            <div className="grid grid-cols-4 gap-x-2">
              {data.tags.map((tag: string) => (
                <p className="text-b">{tag}</p>
              ))}
            </div>
          </div>
        </div>
      )}
      <CopyrightFooter />
    </>
  );
}
