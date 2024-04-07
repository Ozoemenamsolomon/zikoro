import React from "react";
import Image from "next/image";
import { ThreeDotsIcon } from "@/constants/icons";


function AdminPublishedBlog() {
  return (
    <div className="flex flex-col md:flex-row gap-x-0 md:gap-x-8 lg:gap-x-16  cursor-pointer gap-y-6 lg:gap-y-0 px-3 lg:px-10 items-center py-10">
      <Image
        src="/blogPost.webp"
        alt=""
        height={240}
        width={524}
        className="hidden lg:block rounded-lg w-full"
      />
      <Image
        src="/blogPost.webp"
        alt=""
        height={240}
        width={524}
        className="block lg:hidden rounded-lg w-full"
      />

      <div className="flex flex-col justify-center ">
        <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
          Product Updates
        </p>
        <p className="capitalize font-semibold text-base lg:text-3xl ">
          Events Planning And management In Nigeria
        </p>
        <div className="flex uppercase mt-4 text-[12px] lg:text-[15px] font-normal ">
          <p>March 23 2024 {" - "} </p>
          <p>3 Min Read</p>
        </div>
      </div>

      <ThreeDotsIcon/>
    </div>
  );
}

export default AdminPublishedBlog;
