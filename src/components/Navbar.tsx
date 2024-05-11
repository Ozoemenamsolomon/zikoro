"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThreeLine, Close } from "@/constants/icons";
import { getCookie } from "@/hooks";
import { ChevronDown } from "styled-icons/bootstrap";
import { ArrowDownNavbar, ArrowRightNavbar } from "@/constants/icons";

type DBBlogAll = {
  id: number;
  title: string;
  created_at: string;
  category: string;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: JSON;
  views: number;
  shares: JSON;
  tags: [];
  headerImageUrl: string;
};

export default function Navbar() {
  const user = getCookie("user");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState<string>("");
  const [blogData, setBlogData] = useState<DBBlogAll[] | undefined>(undefined);

  const links = [
    {
      linkName: "Features",
      href: "",
      hasArrow: true,
      tag: "features",
    },
    {
      linkName: "Use Cases",
      href: "",
      hasArrow: true,
      tag: "use-cases",
    },
    {
      linkName: "Resources",
      href: "",
      hasArrow: true,
      tag: "resources",
    },
    {
      linkName: "Pricing",
      href: "",
      hasArrow: false,
      tag: "pricing",
    },
    {
      linkName: "Contact Us",
      href: "/contact",
      hasArrow: false,
      tag: "contact",
    },
  ];

  const toggleMenuOn = () => {
    setIsOpen(true);
  };

  const toggleMenuOff = () => {
    setIsOpen(false);
  };

  //fetch events from database
  async function fetchBlogPost() {
    fetch("/api/blog/published", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setBlogData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    // const handleScroll = () => {
    //   if (window.scrollY > 5) {
    //     setScrolling(true);
    //   } else {
    //     setScrolling(false);
    //   }
    // };
    // window.addEventListener("scroll", handleScroll);
    // return () => {
    //   window.removeEventListener("scroll", handleScroll);
    // };

    fetchBlogPost();
  }, []);

  const randomBlog =
    blogData?.[Math.floor(Math.random() * blogData?.length || 0)];

  return (
    <div className="fixed w-full transition-all duration-300 top-0 z-50 ">
      <nav
        // className={` p-4 ${scrolling ? "bg-white" : "bg-white"} text-base  `}
        className=" p-4 bg-white text-base"
      >
        <div className="flex mx-auto lg:max-w-6xl justify-between items-center pb-2">
          {!isOpen && (
            <>
              <Image
                className="cursor-pointer"
                onClick={() => router.push("/")}
                src="/zikoro.png"
                alt="logo"
                width={128}
                height={35}
              />

              <div className="hidden lg:block relative">
                {links.map(({ linkName, href, hasArrow, tag }, i) => {
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setIsHovered(linkName)}
                      onMouseLeave={() => setIsHovered("")}
                      className="relative inline-block"
                    >
                      <Link
                        key={i}
                        href={href}
                        className={` ${
                          pathname === href || isHovered === linkName
                            ? "text-zikoroBlue text-lg font-medium px-4"
                            : "px-4 text-lg font-medium"
                        }`}
                      >
                        {linkName}{" "}
                        {hasArrow && (
                          <ChevronDown
                            className="inline-block ml-1"
                            size={20}
                          />
                        )}
                      </Link>
                      {isHovered === linkName && (
                        <>
                          {tag === "features" && (
                            <div className="absolute border-[1px] border-t-0 border-r-gray-200 border-l-gray-200  border-b-gray-200 top-full left-[-185px] pt-[30px] pb-[60px] rounded-lg mb-5 w-max bg-white -z-8 ">
                              <div className="flex rounded-lg ">
                                <div className="w-9/12 grid gap-[60px] grid-cols-3  pt-[30px] pr-[40px] pb-[60px] pl-[40px]">
                                  <ul className="flex flex-col">
                                    <li className=" uppercase font-semibold text-[18px] whitespace-nowrap ">
                                      Ticketing & Registration
                                    </li>
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Event Website
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Multi-tier Ticketing
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Reminders
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Procedures
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className=" uppercase font-semibold text-[18px] whitespace-nowrap ">
                                      DIGITAL CREDENTIALING
                                    </li>
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Event Website
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Multi-tier Ticketing
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Reminders
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Procedures
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className=" uppercase font-semibold text-[18px] whitespace-nowrap ">
                                      EVENT MANAGEMENT
                                    </li>
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Event Website
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Multi-tier Ticketing
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Reminders
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Procedures
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className=" uppercase font-semibold text-[18px] whitespace-nowrap ">
                                      ATTENDEE MANAGEMENT
                                    </li>
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Event Website
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Multi-tier Ticketing
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Reminders
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Procedures
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className="uppercase font-semibold text-[18px] whitespace-nowrap ">
                                      GAMIFICATION
                                    </li>
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Event Website
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Multi-tier Ticketing
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Reminders
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Procedures
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className="uppercase font-semibold text-[18px] whitespace-nowrap ">
                                      EXHIBITOR’S HUB
                                    </li>
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Event Website
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Multi-tier Ticketing
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Reminders
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Payment Procedures
                                    </li>
                                  </ul>
                                </div>
                                <div className="w-3/12 px-[14px] pt-[52px]">
                                  <p className="text-xl uppercase font-medium">
                                    Featured
                                  </p>
                                  {
                                    <div className="cursor-pointer mt-4 mb-8">
                                      <Image
                                        src={
                                          randomBlog?.headerImageUrl
                                            ? randomBlog?.headerImageUrl
                                            : "/postImage2.png"
                                        }
                                        alt=""
                                        height={103}
                                        width={223}
                                        className="rounded-lg w-[223px] object-cover h-[103px]"
                                      />
                                      <p className="mt-4 text-base font-medium">
                                        {randomBlog?.title}
                                      </p>
                                    </div>
                                  }
                                  <div
                                    onClick={() => router.push("/blog/all")}
                                    className="flex items-center gap-x-2 text-zikoroBlue text-[15px] font-medium"
                                  >
                                    Learn More <ArrowRightNavbar />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {tag === "use-cases" && (
                            <div className="absolute top-full border-[1px] border-t-0 border-r-gray-200 border-l-gray-200  border-b-gray-200 left-[-220px] pt-[30px] pb-[60px] rounded-lg w-max bg-white -z-8">
                              <div className="flex rounded-lg ">
                                <div className="w-8/12 grid gap-[60px] grid-cols-3  pt-[30px] pr-[40px] pb-[60px] pl-[40px]">
                                  <ul className="flex flex-col">
                                    <li className="cursor-pointer mt-7 font-medium text-base">
                                      Conferences
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Education
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Celebration
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Festivals
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className="cursor-pointer mt-7 font-medium text-base whitespace-nowrap">
                                      Tradeshows & Exhibition
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Networking
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Sports
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Charity
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className="cursor-pointer mt-7 font-medium text-base whitespace-nowrap">
                                      Seminars & Workshops
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Culture & Arts
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Job Fairs
                                    </li>
                                  </ul>
                                </div>
                                <div className="w-4/12 px-[14px] pt-[52px]">
                                  <p className="text-xl uppercase font-medium">
                                    Featured
                                  </p>
                                  {
                                    <div className="cursor-pointer mt-4 mb-8">
                                      <Image
                                        src={
                                          randomBlog?.headerImageUrl
                                            ? randomBlog?.headerImageUrl
                                            : "/postImage2.png"
                                        }
                                        alt=""
                                        height={103}
                                        width={223}
                                        className="rounded-lg w-[223px] object-cover h-[103px]"
                                      />
                                      <p className="mt-4 text-base font-medium">
                                        {randomBlog?.title}
                                      </p>
                                    </div>
                                  }
                                  <div
                                    onClick={() => router.push("/blog/all")}
                                    className="flex items-center gap-x-2 text-zikoroBlue text-[15px] font-medium"
                                  >
                                    Learn More <ArrowRightNavbar />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {tag === "resources" && (
                            <div className="absolute top-full border-[1px] border-t-0 border-r-gray-200 border-l-gray-200  border-b-gray-200 left-[-260px] rounded-lg  w-max bg-white pt-[30px] pb-[60px] -z-8">
                              <div className="flex rounded-lg ">
                                <div className="w-9/12 grid gap-[60px] grid-cols-3  pt-[30px] pr-[40px] pl-[40px]">
                                  <ul className="flex flex-col">
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Events
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      FAQ
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className="cursor-pointer whitespace-nowrap mt-6 font-medium text-base ">
                                      Verify Certificates
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Affiliates
                                    </li>
                                  </ul>
                                  <ul className="flex flex-col">
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      Blog
                                    </li>
                                    <li className="cursor-pointer mt-6 font-medium text-base ">
                                      API
                                    </li>
                                  </ul>
                                </div>
                                <div className="w-3/12 px-[14px] pt-[52px]">
                                  <p className="text-xl uppercase font-medium">
                                    Featured
                                  </p>
                                  {
                                    <div className="cursor-pointer mt-4 mb-8">
                                      <Image
                                        src={
                                          randomBlog?.headerImageUrl
                                            ? randomBlog?.headerImageUrl
                                            : "/postImage2.png"
                                        }
                                        alt=""
                                        height={103}
                                        width={223}
                                        className="rounded-lg w-[223px] object-cover h-[103px]"
                                      />
                                      <p className="mt-4 text-base font-medium">
                                        {randomBlog?.title}
                                      </p>
                                    </div>
                                  }
                                  <div
                                    onClick={() => router.push("/blog/all")}
                                    className="flex items-center gap-x-2 text-zikoroBlue text-[15px] font-medium"
                                  >
                                    Learn More <ArrowRightNavbar />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className=" gap-4 hidden lg:flex">
                <button
                  onClick={() => router.push("/register")}
                  className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md "
                >
                  Sign up
                </button>

                <button
                  onClick={() => {
                    if (user) {
                      router.push("/home");
                    } else {
                      router.push("/login");
                    }
                  }}
                  className="text-base text-blue-700 bg-transparent border border-indigo-800 py-[10px] px-5 rounded-md "
                >
                  Login
                </button>
              </div>

              <div className="lg:hidden">
                <button className="text-black" onClick={toggleMenuOn}>
                  <ThreeLine />
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div className="lg:hidden max-w-full h-screen px-5 bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end pb-8 -cursor-pointer mt-[-32px] md:mt-[-37px] pt-8">
            <div className="flex flex-col">
              <div
                className="flex justify-end items-end pb-10 "
                onClick={toggleMenuOff}
              >
                <Close />
              </div>

              <div className="flex flex-col  text-white ">
                {links.map(({ linkName, href, hasArrow }, i) => {
                  return (
                    <Link
                      key={i}
                      href={href}
                      className="text-xl font-medium pb-7"
                    >
                      {linkName}
                    </Link>
                  );
                })}
              </div>

              <div className=" gap-5 flex md:hidden pt-12">
                <button
                  onClick={() => router.push("/home")}
                  className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white w-1/2"
                >
                  Sign up
                </button>

                <button
                  onClick={() => router.push("/home")}
                  className="text-base text-white bg-transparent border border-white py-[10px] px-5 rounded-md w-1/2 "
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
