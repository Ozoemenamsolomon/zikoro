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


export default function PostArticle() {

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

  // useEffect(() => {
  //   const extractedDate = extractDate(createdAt)
  //   setDate(extractedDate);
  // }, []);


  return (
    <div className="flex flex-col cursor-pointer gap-y-6 lg:gap-y-16 ">
     
        <Image
          src="/default.png"
          alt=""
          height={240}
          width={524}
          className="hidden lg:block rounded-lg w-full"
        />
        <Image
          src="/default.png"
          alt=""
          height={335}
          width={160}
          className="block lg:hidden rounded-lg w-full"
        />

      <div className="flex flex-col justify-center max-w-full lg:max-w-md ">
        <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
          Product Updates
        </p>
        <p className="capitalize font-semibold text-base lg:text-2xl ">
          Events Planning And Management In Nigeria
        </p>
        <div className="flex uppercase mt-4 text-[12px] lg:text-[15px] font-normal ">
          <p>March 23 2024 {" - "} </p>
          <p>3 Min Read</p>
        </div>
      </div>
    </div>
  );
}
