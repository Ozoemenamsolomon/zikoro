"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThreeLine, Close } from "@/constants/icons";
import { getCookie } from "@/hooks";
import { ChevronDown } from "styled-icons/bootstrap";
import { MobileNavbarArrowLeft, ArrowRightNavbar } from "@/constants/icons";

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
  const [showSubLinks, setShowSubLinks] = useState(false);
  const [subLinkIndex, setSubLinkIndex] = useState<number>(0);

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

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseSubLinks = () => {
    setShowSubLinks(false);
  };

  const handleMobileLinkClick = (i: number) => {
    setShowSubLinks(true);
    setSubLinkIndex(i);
  };

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
                        className={`${
                          (pathname === href || isHovered === linkName) &&
                          href !== ""
                            ? "text-zikoroBlue text-lg font-medium px-4"
                            : "px-4 text-lg font-medium"
                        } ${href === "" ? "text-white" : ""}`}
                      >
                        {linkName}{" "}
                        {hasArrow && (
                          <ChevronDown
                            className="inline-block ml-1"
                            size={20}
                          />
                        )}
                      </Link>
                      {/* {isHovered === linkName && (
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
                      )} */}
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
                <button className="text-black" onClick={toggleMenu}>
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
          {!showSubLinks && (
            <div className="lg:hidden max-w-full h-screen px-5 bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end pb-8 -cursor-pointer mt-[-32px] md:mt-[-37px] pt-8">
              <div className="flex flex-col">
                <div
                  className="flex justify-end items-end pb-10 "
                  onClick={toggleMenu}
                >
                  <Close />
                </div>

                <div className="flex flex-col  text-white ">
                  {links.map(({ linkName, hasArrow, href }, i) => {
                    // return (
                    //   <p
                    //     key={i}
                    //     onClick={() => handleMobileLinkClick(i)}
                    //     className="text-xl font-medium pb-7 flex items-center gap-x-2"
                    //   >
                    //     {linkName} {hasArrow && <ArrowRightNavbar />}
                    //   </p>
                    // );
                    return (
                      <React.Fragment key={i}>
                        {hasArrow ? (
                          <p
                            key={i}
                            onClick={() => handleMobileLinkClick(i)}
                            className="text-xl font-medium pb-7 flex items-center text-transparent gap-x-2 "
                          >
                            {linkName}
                            {/* <ArrowRightNavbar /> */}
                          </p>
                        ) : (
                          <Link
                            href={href} // Assuming you want to use the index as part of the link
                            className={`text-xl font-medium pb-7 flex items-center gap-x-2 ${
                              href === "" ? "text-transparent" : "text-white"
                            }`}
                          >
                            {linkName}
                          </Link>
                        )}
                      </React.Fragment>
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
          )}

          {/* {showSubLinks && (
            <div className="fixed px-3 top-0 left-0 w-full h-full bg-white bg-opacity-100 z-50 items-center overflow-y-auto no-scrollbar">
              <div className="p-4 rounded-lg">
                <button onClick={handleCloseSubLinks} className="flex gap-x-2">
                  {" "}
                  <MobileNavbarArrowLeft />
                  Close
                </button>

                <div className=" my-10">
                  {subLinkIndex == 0 && (
                    <div className="flex flex-col gap-y-7">
                      <ul className="flex flex-col gap-y-6">
                        <li className="text-lg font-semibold">
                          TICKETING & REGISTRATION{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Event Website{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Multi-tier ticketing{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment reminders{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment procedures{" "}
                        </li>
                      </ul>

                      <ul className="flex flex-col gap-y-6">
                        <li className="text-lg font-semibold">
                          DIGITAL CREDENTIALING{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Event Website{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Multi-tier ticketing{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment reminders{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment procedures{" "}
                        </li>
                      </ul>

                      <ul className="flex flex-col gap-y-6 ">
                        <li className="text-lg font-semibold">
                          Event MANAGEMENT{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Event Website{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Multi-tier ticketing{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment reminders{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment procedures{" "}
                        </li>
                      </ul>

                      <ul className="flex flex-col gap-y-6 ">
                        <li className="text-lg font-semibold">
                          ATTENDEE MANAGEMENT{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Event Website{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Multi-tier ticketing{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment reminders{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment procedures{" "}
                        </li>
                      </ul>

                      <ul className="flex flex-col gap-y-6 ">
                        <li className="text-lg font-semibold">GAMIFICATION </li>
                        <li className="text-base font-medium">
                          {" "}
                          Event Website{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Multi-tier ticketing{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment reminders{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment procedures{" "}
                        </li>
                      </ul>

                      <ul className="flex flex-col gap-y-6 ">
                        <li className="text-lg font-semibold">
                          EXHIBITOR'S HUB{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Event Website{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Multi-tier ticketing{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment reminders{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Payment procedures{" "}
                        </li>
                      </ul>
                    </div>
                  )}

                  {subLinkIndex == 1 && (
                    <div className="flex flex-col gap-y-7">
                      <ul className="flex flex-col gap-y-6">
                        <li className="text-base font-medium"> Conferences </li>
                        <li className="text-base font-medium">
                          {" "}
                          Tradeshows & Exhibition{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Seminars & Workshops{" "}
                        </li>
                        <li className="text-base font-medium"> Education </li>
                        <li className="text-base font-medium"> Networking </li>

                        <li className="text-base font-medium">
                          {" "}
                          Culture & Arts{" "}
                        </li>

                        <li className="text-base font-medium"> Celebration </li>

                        <li className="text-base font-medium"> Sports </li>

                        <li className="text-base font-medium"> Job Fairs </li>

                        <li className="text-base font-medium"> Festivals </li>

                        <li className="text-base font-medium"> Charity </li>
                      </ul>
                    </div>
                  )}

                  {subLinkIndex == 2 && (
                    <div className="flex flex-col gap-y-7">
                      <ul className="flex flex-col gap-y-6">
                        <li className="text-base font-medium">
                          {" "}
                          Event{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Verify Certificates{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Blog{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          FAQ{" "}
                        </li>
                        <li className="text-base font-medium">
                          {" "}
                          Affiliates{" "}
                        </li>

                        <li className="text-base font-medium">
                          {" "}
                          API{" "}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )} */}
        </>
      )}
    </div>
  );
}
