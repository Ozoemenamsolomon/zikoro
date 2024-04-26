import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AdminBlogShareIcon2,
  AdminBlogViewIcon2,
  ThreeDotsIcon,
} from "@/constants/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

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

  useEffect(() => {
    //extract date
    const extractedDate = extractAndFormatDate(createdAt);
    setDate(extractedDate);
  }, []);

  //function that shows the blog post
  function goToPost() {
    window.open(`/post/${id}`, "_blank");
  }

  //function that delete post
  function deletePost() {
    window.open(`/post/${id}`, "_blank");
  }

  //function that unPublish post
  function unPublishPost() {}

  //function that edit post
  function editPost() {
    window.open(`/post/${id}`, "_blank");
  }

  return (
    <div className="flex flex-col md:flex-row gap-x-0 md:gap-x-8 lg:gap-x-10 gap-y-6 lg:gap-y-0 px-3 lg:px-10 items-center py-10">
      <div className="w-full lg:w-1/2">
        <Image
          src={headerImageUrl ? headerImageUrl : "/postImage2.png"}
          alt=""
          height={240}
          width={480}
          className="hidden lg:block rounded-lg w-[480px] h-[240px] object-cover"
        />
        <Image
          src={headerImageUrl ? headerImageUrl : "/postImage2.png"}
          alt=""
          height={240}
          width={367}
          className="block lg:hidden rounded-lg w-full object-cover h-[160px]"
        />
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 ">
        <div className="flex lg:flex-col items-center  juustify-between ">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
                {category}
              </p>

              {draft && (
                <p className="py-1 px-2 bg-blue-200 text-zikoroBlue font-bold text-[10px] lg:text-[12px] rounded-lg">
                  {" "}
                  Draft{" "}
                </p>
              )}
              {scheduled && (
                <p className="py-1 px-2 bg-blue-200 text-zikoroBlue font-bold text-[10px] lg:text-[12px] rounded-lg">
                  {" "}
                  Scheduled{" "}
                </p>
              )}
            </div>

            <p className="capitalize font-semibold text-lg lg:text-3xl ">
              {title}
            </p>

            {status == "publish" && (
              <div className="flex uppercase mt-2 text-[12px] gap-x-1 lg:text-[15px] font-normal ">
                <p>
                  {date} {" - "}
                </p>
                <p>3 Min Read</p>
              </div>
            )}

            {status == "publish" && (
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
            <Popover>
              <PopoverTrigger>
                <ThreeDotsIcon />
              </PopoverTrigger>
              <PopoverContent className="w-24 mr-4 text-center">
                <ul>
                  <li
                    // onClick={}
                    className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
                  >
                    Edit
                  </li>

                  <li
                    onClick={goToPost}
                    className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
                  >
                    View
                  </li>

                  <li
                    // onClick={}
                    className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
                  >
                    Delete
                  </li>

                  {status == "publish" && (
                    <li
                      // onClick={}
                      className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
                    >
                      Unpublish
                    </li>
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="hidden lg:inline">
        <Popover>
          <PopoverTrigger>
            <ThreeDotsIcon />
          </PopoverTrigger>
          <PopoverContent className="w-24 mr-4 text-center">
            <ul>
              <li
                // onClick={}
                className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
              >
                Edit
              </li>

              <li
                onClick={goToPost}
                className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
              >
                View
              </li>

              <li
                // onClick={}
                className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
              >
                Delete
              </li>

              {status == "publish" && (
                <li
                  // onClick={}
                  className="py-1 text-xs lowercase cursor-pointer hover:text-indigo-700"
                >
                  Unpublish
                </li>
              )}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
