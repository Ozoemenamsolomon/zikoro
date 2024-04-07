"use client";
import React from "react";
import TextEditor from "@/components/TextEditor";
import { useForm } from "react-hook-form";


export default function Create() {
  const form = useForm<any>({});

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const content = watch("content");

  const setMessage = (content: string) => {
    console.log(content);
    setValue("content", content);
  };

  return (
    <div className=''>
      <div className=" flex flex-col pl-3 lg:pl-10 pr-3 lg:pr-28 pt-28 ">
        <p className="text-2xl lg:text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text ">
          Create New Blog Post
        </p>

        <div className="mt-8 lg:mt-[60px] bg-white flex-1 resize-none h-fit mb-10 ">
          <TextEditor
            onChange={setMessage}
            defaultValue={content}
            placeholder="Write message"
          />
        </div>
      </div>
    </div>
  );
}
