"use client";
import React from "react";
import Image from "next/image";
import { Facebook, X, Linkedin, Instagram } from "@/constants/icons";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div className="pt-24 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end ">
      <div className=" max-w-6xl mx-auto px-5 lg:px-0">
        <div className="lg:flex lg:justify-center lg:items-center">
          <Image
            className="hidden lg:inline"
            src="/zikoroFooter.png"
            alt=""
            width={400}
            height={109}
          />
          <Image
            className=" lg:hidden"
            src="/zikoroFooter.png"
            alt=""
            width={250}
            height={68}
          />
        </div>
        <p className="lg:text-center font-normal text-xs lg:text-xl mt-7">
          2A Musari Apena Street, Ewu-Titan, off Labinjo Kalejaiye Street,{" "}
          <span className="inline lg:block">
            {" "}
            Mafoluku, Oshodi, Lagos State, Nigeria{" "}
          </span>{" "}
        </p>
      </div>

      <div className="px-5 lg:px-0 mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-5 gap-x-24 gap-y-6 lg:gap-x-24 lg:gap-y-24  max-w-6xl mx-auto">
        {/* 1st Column */}
        <ul className="flex flex-col space-y-1 lg:space-y-4 ">
          <li className="text-[15px] lg:text-2xl font-bold ">Company</li>
          <li className=" text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0 text-transparent">
            About Us
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Careers
          </li>
          <li
            onClick={() => router.push("/contact")}
            className="text-[13px] lg:text-base font-normal cursor-pointer"
          >
            Contact Us
          </li>
        </ul>

        {/* 2nd Column */}
        <ul className="flex flex-col space-y-1 lg:space-y-4">
          <li className="text-[15px] lg:text-2xl  font-bold cursor-pointer ">
            Features
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0 text-transparent">
            Ticketing & Registration
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Event Management
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Attendee Engagement
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Gamification
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Exhibitors’ Hub
          </li>
        </ul>

        {/* 3rd Column */}
        <ul className="flex flex-col space-y-1 lg:space-y-4">
          <li className="text-[15px] lg:text-2xl font-bold cursor-pointer ">
            Use cases
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent pt-4 lg:pt-0">
            Conferences
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Tradeshows & Exhibitions
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Seminars & Workshops
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Careers
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Education
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Culture & Arts
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Celebrations
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Sports
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Job Fairs
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Festivals
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Charity
          </li>
        </ul>

        {/* 4th Column */}
        <ul className="flex flex-col space-y-1 lg:space-y-4">
          <li className="text-[15px] lg:text-2xl font-bold cursor-pointer ">
            Resources
          </li>
          <li
            onClick={() => router.push("/explore")}
            className="text-[13px] lg:text-base font-normal cursor-pointer pt-4 lg:pt-0"
          >
            Explore Events
          </li>
          <li
            onClick={() => router.push("/verify")}
            className="text-[13px] lg:text-base font-normal cursor-pointer"
          >
            Verify Certificates
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            FAQ
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Affiliates
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            API
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Help
          </li>
          <li
            onClick={() => router.push("/blog/all")}
            className="text-[13px] lg:text-base font-normal cursor-pointe text-transparent"
          >
            Blog
          </li>
        </ul>

        {/* 5th Column */}
        <ul className="flex flex-col space-y-1 lg:space-y-4">
          <li className="text-[15px] lg:text-2xl font-bold cursor-pointer">
            Legal
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent pt-4 lg:pt-0">
            Terms and Condition
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Privacy Policy
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Refund Policy
          </li>
          <li className="text-[13px] lg:text-base font-normal cursor-pointer text-transparent">
            Cookies
          </li>
        </ul>
      </div>

      <div className="mt-4 lg:mt-6 border-t-[1px] border-indigo-500 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end  px-5 lg:px-0">
        <div className="max-w-6xl  mx-auto py-4 lg:py-14 flex justify-between">
          <p className="text-[13px] lg:text-base font-normal">
            {" "}
            <span className="hidden lg:inline">Copyright</span> © 2024 - Zikoro{" "}
            <span className="hidden lg:inline"> - an OrthoEx</span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
