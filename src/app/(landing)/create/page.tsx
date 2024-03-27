"use client";
import React from "react";
import { TextEditor } from "@/components/TextEditor";


export default function Create() {
  return (
    <div className="flex bg-gray-200 gap-x-[40px] h-screen ">
      <div className="bg-white w-2/12"></div>
      <div className="w-9/12 bg-gray-200 flex flex-col mt-20 ">
        <p className="text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text ">
          Create New Blog Post
        </p>

        <div className="mt-[110px] bg-white flex-1 p-4 resize-none">
        {/* <TextEditor onChange={(e) => e} markdown="" /> */}
        
        </div>
      </div>
    </div>
  );
}
