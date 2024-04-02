"use client";
import React from "react";
import Image from "next/image";
import Facebook from "@/components/svg/Facebook";
import X from "@/components/svg/X";
import Linkedin from "@/components/svg/Linkedin";
import Instagram from "@/components/svg/Instagram";
import PostArticle from "@/components/blog/PostArticle";

export default function PostId() {
  return (
    <div className="mt-[120px] lg:mt-[200px] px-3 lg:px-0">
      {/* header section */}
      <div className="max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
        <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-4 text-center ">
          <p className="text-indigo-600 text-[12px] lg:text-[15px] font-medium">
            Product Updates
          </p>
          <p className="capitalize text-2xl font-semibold lg:text-4xl ">
            Event Planning and management in Nigeria
          </p>
          <p className="uppercase text-gray-400">
            MARCH 23, 2024 - <span>3 mIN READ </span>
          </p>
        </div>
        <Image
          src="/postImage.webp"
          alt=""
          width={982}
          height={450}
          className=""
        />
      </div>

      {/* body section */}
      <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-28 lg:mb-20 ">
        {/* Left */}
        <div className="hidden lg:inline h-full pb-12 w-full flex-col  lg:w-3/12">
          {/* section links */}
          <div className="flex-col">
            {/* Top */}
            <p className="text-xl font-semibold">On This Page</p>
            {/* Links */}
            <p className="text-base font-normal mt-8">
              Lorem ipsum dolor sit amet consectetur. Vitae sollicitudin tellus{" "}
            </p>

            <p className="text-base font-normal mt-8">
              Lorem ipsum dolor sit amet consectetur. Vitae sollicitudin tellus{" "}
            </p>
          </div>

          {/* Share Buttons */}
          <div className="mt-8">
            <p className="text-xl font-medium">Share This Article</p>
            <div className="flex gap-x-[14px] mt-4">
              <X />
              <Facebook />
              <Instagram />
              <Linkedin />
            </div>
          </div>
        </div>

        <div className=" h-full lg:h-auto lg:w-9/12  flex-col overscroll-y-hidden lg:overflow-y-auto scrollbar-hide  pb-0 lg:pb-[50px]">
          <p className="font-normal text-base lg:text-xl mt-10">
            Lorem ipsum dolor sit amet consectetur. Fermentum bibendum viverra
            dictum senectus. Viverra ac dolor cursus non sed pellentesque
            feugiat. Proin nunc morbi tortor morbi etiam tortor. Egestas quam
            amet cum egestas vel lobortis ullamcorper vitae.
          </p>
          <Image
            src="/postImage2.png"
            alt=""
            className="mt-10 hidden lg:block"
            height={269}
            width={833}
          />
          <Image
            src="/postImage2.png"
            alt=""
            className="mt-10 block lg:hidden w-full"
            height={160}
            width={335}
          />
          <p className="font-semibold text-base lg:text-xl mt-10">
            Lorem ipsum dolor sit amet consectetur.
          </p>
          <p className="font-normal text-base lg:text-xl mt-10">
            Lorem ipsum dolor sit amet consectetur. Fermentum bibendum viverra
            dictum senectus. Viverra ac dolor cursus non sed pellentesque
            feugiat. Proin nunc morbi tortor morbi etiam tortor. Egestas quam
            amet cum egestas vel lobortis ullamcorper vitae.
          </p>
          <Image
            src="/postImage2.png"
            alt=""
            className="mt-10 hidden lg:block"
            height={269}
            width={833}
          />
          <Image
            src="/postImage2.png"
            alt=""
            className="mt-10 block lg:hidden w-full"
            height={160}
            width={335}
          />
          <p className="font-semibold text-base lg:text-xl mt-10">
            Lorem ipsum dolor sit amet consectetur.
          </p>
          <p className="font-normal text-base lg:text-xl mt-10">
            Lorem ipsum dolor sit amet consectetur. Fermentum bibendum viverra
            dictum senectus. Viverra ac dolor cursus non sed pellentesque
            feugiat. Proin nunc morbi tortor morbi etiam tortor. Egestas quam
            amet cum egestas vel lobortis ullamcorper vitae.
          </p>
          <Image
            src="/postImage2.png"
            alt=""
            className="mt-10 hidden lg:block"
            height={269}
            width={833}
          />
          <Image
            src="/postImage2.png"
            alt=""
            className="mt-10 block lg:hidden w-full"
            height={160}
            width={335}
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t-0 lg:border-t-[1px] border-gray-300 mb-12 lg:mb-24">
            <p className="text-center text-xl lg:text-3xl font-semibold mt-14">Read More Articles</p>
            <div className="flex flex-col lg:flex-row  px-0 lg:px-[146px] gap-x-0 lg:gap-x-[100px] gap-y-7 lg:gap-y-0 py-7 lg:py-16">
                    <PostArticle/>
                    <PostArticle/>
            </div>
      </div>
    </div>
  );
}
