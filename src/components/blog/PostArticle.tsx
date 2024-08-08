"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type BlogPostProps = {
  id: number;
  title: string;
  createdAt: string;
  category: string;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: JSON;
  views: number;
  shares: number;
  headerImageUrl: string;
  tags: string[];
};

export default function PostArticle({
  id,
  title,
  createdAt,
  category,
  status,
  statusDetails,
  readingDuration,
  content,
  views,
  shares,
  headerImageUrl,
  tags,
}: BlogPostProps) {
  // Extracting the date only
  function extractDate(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString().split("T")[0]; // Extracting the date portion
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }

  const [date, setDate] = useState<string | null>(null);

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: string): string {
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

  //FORMAT DATE INTO STRINGS
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

  //function that shows the blog post
  function goToPost() {
    window.open(`/post/${id}`, "_self");
  }

  useEffect(() => {
    //extract date
    const extractedDate = extractAndFormatDate(createdAt);
    setDate(extractedDate);
  }, []);

  return (
    <div
      onClick={goToPost}
      className="flex flex-col cursor-pointer gap-y-6 lg:gap-y-16  "
    >
      <Image
        src={headerImageUrl ? headerImageUrl : "/postImage2.png"}
        alt=""
        height={240}
        width={524}
        className="hidden lg:block rounded-lg w-[524px] h-[240px] object-cover"
      />
      <Image
        src={headerImageUrl ? headerImageUrl : "/postImage2.png"}
        alt=""
        width={335}
        height={160}
        className="block lg:hidden rounded-lg w-full h-[160px] object-cover"
      />

      <div className="flex flex-col justify-center max-w-full lg:max-w-md ">
        <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
          {category}
        </p>
        <p className="capitalize font-semibold text-base lg:text-2xl ">
          {title}
        </p>
        <div className="flex uppercase mt-4 text-[12px] lg:text-[15px] font-light ">
          <p>
            {date}
            {" - "}
          </p>
          <p>{readingDuration} Min Read</p>
        </div>
      </div>
    </div>
  );
}
