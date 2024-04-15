"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type BlogPostProps = {
  id: number;
  title: string;
  createdAt: string;
  category: JSON;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: JSON;
  views: number;
  shares: JSON;
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

  //function that shows the event details
  function goToPost() {
    window.open(`/post/${id}`, "_blank");
  }

  useEffect(() => {
    const extractedDate = extractDate(createdAt);
    setDate(extractedDate);
  }, []);

  return (
    <div
      onClick={goToPost}
      className="flex flex-col md:flex-row gap-x-0 md:gap-x-8 lg:gap-x-16  cursor-pointer gap-y-6 lg:gap-y-0 px-3 lg:px-0"
    >
      <Image
        src="/default.png"
        alt=""
        height={240}
        width={524}
        className="hidden lg:block rounded-lg w-fit"
      />
      <Image
        src="/default.png"
        alt=""
        height={240}
        width={524}
        className="block lg:hidden rounded-lg w-fit"
      />

      <div className="flex flex-col justify-center ">
        <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
          Product Updates
        </p>
        <p className="capitalize font-semibold text-base lg:text-3xl ">
          {title}
        </p>
        <div className="flex uppercase mt-4 text-[12px] lg:text-[15px] font-normal ">
          <p>
            {date}
            {" - "}{" "}
          </p>
          <p>3 Min Read</p>
        </div>
      </div>
    </div>
  );
}
