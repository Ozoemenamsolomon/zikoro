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
  shares: JSON;
  tags: [];
  headerImageUrl: string;
};

export default function BlogPost({
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
  tags,
  headerImageUrl,
}: BlogPostProps) {
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
      className="flex flex-col md:flex-row gap-x-0 md:gap-x-8 lg:gap-x-16  cursor-pointer gap-y-6 lg:gap-y-0 px-3 lg:px-0"
    >
      <div className="">
        <Image
          src={headerImageUrl ? headerImageUrl : "/postImage2.png"}
          alt=""
          height={240}
          width={524}
          className="hidden lg:block rounded-lg w-[480px] max-w-[480px] h-[240px] object-cover"
        />
        <Image
          src={headerImageUrl ? headerImageUrl : "/postImage2.png"}
          alt=""
          height={240}
          width={367}
          className="block lg:hidden rounded-lg w-full object-cover h-[160px]"
        />
      </div>

      <div className="flex flex-col justify-center ">
        <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
          {category}
        </p>
        <p className="capitalize font-semibold text-lg lg:text-3xl mt-2">
          {title}
        </p>
        <div className="flex gap-x-2 uppercase mt-2 text-[12px] lg:text-base font-light ">
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
