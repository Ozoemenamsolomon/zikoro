"use client";
import Image from "next/image";
import React from "react";

export default function PostArticle() {
  return (
    <div className="flex flex-col cursor-pointer gap-y-6 lg:gap-y-16 ">
     
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
          height={335}
          width={160}
          className="block lg:hidden rounded-lg w-full"
        />

      <div className="flex flex-col justify-center max-w-full lg:max-w-md ">
        <p className="text-indigo-700 capitalize font-medium text-xs lg:text-base">
          Product Updates
        </p>
        <p className="capitalize font-semibold text-base lg:text-2xl ">
          Events Planning And management In Nigeria
        </p>
        <div className="flex uppercase mt-4 text-[12px] lg:text-[15px] font-normal ">
          <p>March 23 2024 {" - "} </p>
          <p>3 Min Read</p>
        </div>
      </div>
    </div>
  );
}
