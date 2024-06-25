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

export default function OrganizationNavbar() {
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
      href: "/pricing",
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

              {/* <div className="hidden lg:block relative">
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
                    </div>
                  );
                })}
              </div> */}

              {/* <div className=" gap-4 hidden lg:flex">
                <button
                  onClick={() => router.push("/register")}
                  className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md "
                >
                  Sign up
                </button>

                <button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="text-base text-blue-700 bg-transparent border border-indigo-800 py-[10px] px-5 rounded-md "
                >
                  Login
                </button>
              </div> */}

              {/* <div className="lg:hidden">
                <button className="text-black" onClick={toggleMenu}>
                  <ThreeLine />
                </button>
              </div> */}
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
