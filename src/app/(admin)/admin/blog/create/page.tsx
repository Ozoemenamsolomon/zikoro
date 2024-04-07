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
      <div className="  flex flex-col px-3 md:px-10 pt-28  h-[calc(100%-64px)]  lg:h-[calc(100vh-180px)] ">
        <p className="text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text ">
          Create New Blog Post
        </p>

        <div className="mt-[110px] bg-white flex-1 resize-none h-fit mb-10 ">
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
