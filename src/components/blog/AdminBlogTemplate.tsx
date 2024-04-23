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
  shares: number;
  draft: boolean;
  scheduled: boolean;
  headerImageUrl: string;
  tags: string[];
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

  useEffect(() => {
    const extractedDate = extractDate(createdAt);
    setDate(extractedDate);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-x-0 md:gap-x-8 lg:gap-x-10 gap-y-6 lg:gap-y-0 px-3 lg:px-10 items-center py-10">
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
        height={240}
        width={367}
        className="block lg:hidden rounded-lg w-[367px] h-[240px]"
      />

      <div className="flex flex-col justify-center w-full lg:w-fit px-4 ">
        <div className="flex lg:flex-col items-center  juustify-between ">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-indigo-700 capitalize font-medium text-sm">
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

            <p className="capitalize font-semibold text-lg ">{title}</p>

            {!draft && !scheduled && (
              <div className="flex uppercase mt-2 text-[12px] lg:text-[15px] font-normal ">
                <p>
                  {date} {" - "}{" "}
                </p>
                <p>3 Min Read</p>
              </div>
            )}

            {!draft && !scheduled && (
              <div className="flex gap-x-10 mt-2 text-[12px] lg:text-[15px] font-normal ">
                <div className="flex items-center gap-x-2">
                  <AdminBlogViewIcon2 />
                  <p className="">{views} Views</p>
                </div>

                <div className="flex items-center gap-x-2">
                  <AdminBlogShareIcon2 />
                  <p className="">{shares} Shares</p>
                </div>
              </div>
            )}

            {draft && (
              <div className="flex gap-x-3 mt-2 text-sm font-normal ">
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
              <div className="flex gap-x-3 mt-2 text-sm font-normal ">
                <p className="font-medium">
                  Scheduled For:{" "}
                  <span className="font-normal uppercase">March 23 2024 </span>
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
