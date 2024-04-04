"use client";
import React from "react";
import BlogPost from "./BlogPost";

export default function BlogPosts() {
  return (
    <>
      <div className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[52px] lg:mt-[100px]">
        <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost />
        </div>

        <div className=" flex justify-center items-center my-[48px] lg:my-[80px]">
          <button className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white">
            See more
          </button>
        </div>
     
    </>
  );
}
