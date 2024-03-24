"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ThreeLine from "@/components/svg/ThreeLine";
import Close from "@/components/svg/Close";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Features",
      href: "/features",
    },
    {
      name: "Use Cases",
      href: "/use-cases",
    },
    {
      name: "Resources",
      href: "/resources",
    },
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "Contact Us",
      href: "/contact",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenuOn = () => {
    setIsOpen(true);
  };

  const toggleMenuOff = () => {
    setIsOpen(false);
  };

  const router = useRouter();

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed w-full transition-all duration-300 top-0 z-50 ">
      <nav
        className={` p-4 ${
          scrolling
            ? "bg-white"
            : "bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end"
        } border-b-[2px] border-indigo-500 text-base  `}
      >
        <div className=" flex mx-auto lg:max-w-6xl justify-between items-center pb-2">
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

              <div className="hidden md:block">
                {links.map(({ name, href }, index) => {
                  return (
                    <Link
                      key={index}
                      href={href}
                      className={` ${
                        pathname === href
                          ? "text-zikoroBlue text-lg font-medium px-4"
                          : "px-4 text-lg font-medium"
                      }`}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>

              <div className=" gap-4 hidden md:flex">
                <button
                  onClick={() => router.push("/api/auth/login")}
                  className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md "
                >
                  Register
                </button>

                <button
                  onClick={() => router.push("/api/auth/login")}
                  className="text-base text-blue-700 bg-transparent border border-indigo-800 py-[10px] px-5 rounded-md "
                >
                  Login
                </button>
              </div>

              <div className="md:hidden">
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
        <div className="md:hidden bg-gradient-to-tr max-w-full h-screen px-5 from-custom-gradient-start to-custom-gradient-end pb-8 -mt-10 pt-8">
          <div className="flex flex-col">
            <div
              className="flex justify-end items-end pb-10 "
              onClick={toggleMenuOff}
            >
              <Close />
            </div>

            <div className="flex flex-col items-center text-white ">
              {links.map(({ name, href }) => {
                return (
                  <Link href={href} className="text-xl font-medium pb-7">
                    {name}
                  </Link>
                );
              })}
            </div>

            <div className=" gap-5 flex justify-center items-center md:hidden pt-12">
              <button
                onClick={() => router.push("/api/auth/login")}
                className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
              >
                Register
              </button>

              <button
                onClick={() => router.push("/api/auth/login")}
                className="text-base text-white bg-transparent border border-white py-[10px] px-5 rounded-md "
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
