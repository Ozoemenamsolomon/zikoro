import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AdminBlogShareIcon2,
  AdminBlogViewIcon2,
  ThreeDotsIcon,
} from "@/constants/icons";

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
  draft: boolean;
  scheduled: boolean;
};

export default function AdminBlogTemplate({
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
  draft,
  scheduled,
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

  useEffect(() => {
    const extractedDate = extractDate(createdAt);
    setDate(extractedDate);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-x-0 md:gap-x-8 lg:gap-x-10  cursor-pointer gap-y-6 lg:gap-y-0 px-3 lg:px-10 items-center py-10">
      <Image
        src="/postImage2.png"
        alt=""
        height={240}
        width={367}
        className="hidden lg:block rounded-lg w-fit "
      />
      <Image
        src="/postImage2.png"
        alt=""
        height={240}
        width={524}
        className="block lg:hidden rounded-lg w-fit"
      />

      <div className="flex flex-col justify-center ">
        <div className="flex lg:flex-col items-center ">
          <div className="">
            <div className="flex justify-between">
              <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
                Product Updates
              </p>

              {draft && (
                <p className="py-1 px-2 bg-blue-200 text-zikoroBlue font-bold text-[12px] rounded-lg">
                  {" "}
                  Draft{" "}
                </p>
              )}
              {scheduled && (
                <p className="py-1 px-2 bg-blue-200 text-zikoroBlue font-bold text-[12px] rounded-lg">
                  {" "}
                  Scheduled{" "}
                </p>
              )}
            </div>

            <p className="capitalize font-semibold text-base lg:text-2xl ">
              {title}
            </p>
            <div className="flex uppercase mt-4 text-[12px] lg:text-[15px] font-normal ">
              <p>
                {date} {" - "}{" "}
              </p>
              <p>3 Min Read</p>
            </div>

            {!draft && !scheduled && (
              <div className="flex gap-x-10 mt-4 text-[12px] lg:text-[15px] font-normal ">
                <div className="flex items-center gap-x-2">
                  <AdminBlogViewIcon2 />
                  <p className="">1k Views</p>
                </div>

                <div className="flex items-center gap-x-2">
                  <AdminBlogShareIcon2 />
                  <p className="">1k Shares</p>
                </div>
              </div>
            )}

            {draft && (
              <div className="flex gap-x-10 mt-4 text-[12px] lg:text-[15px] font-normal ">
                <p className="font-medium">
                  Last Updated:{" "}
                  <span className="font-normal uppercase">
                    March 23 2024 -{" "}
                  </span>
                </p>
                <p className=" uppercase">3 Min Read</p>
              </div>
            )}

            {scheduled && (
              <div className="flex gap-x-10 mt-4 text-[12px] lg:text-[15px] font-normal ">
                <p className="font-medium">
                  Scheduled For:{" "}
                  <span className="font-normal uppercase">
                    March 23 2024 {" "}
                  </span>
                </p>
                <p className=" uppercase">1:19 PM</p>
              </div>
            )}
          </div>
          <div className="inline lg:hidden">
            <ThreeDotsIcon />
          </div>
        </div>
      </div>
      <div className="hidden lg:inline">
        <ThreeDotsIcon />
      </div>
    </div>
  );
}
