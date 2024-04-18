"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThreeLine, Close } from "@/constants/icons";
import { getCookie } from "@/hooks";
export default function Navbar() {
  const user = getCookie("user");
  const pathname = usePathname();

  const links = [
    {
      name: "Features",
      href: "",
    },
    {
      name: "Use Cases",
      href: "",
    },
    {
      name: "Resources",
      href: "",
    },
    {
      name: "Pricing",
      href: "",
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
      if (window.scrollY > 5) {
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
        className={` p-4 ${scrolling ? "bg-white" : "bg-white"} text-base  `}
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

              <div className="hidden lg:block">
                {links.map(({ name, href }, i) => {
                  return (
                    <Link
                      key={i}
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
        <div className="lg:hidden bg-gradient-to-tr max-w-full h-screen px-5 from-custom-gradient-start to-custom-gradient-end pb-8 -mt-10 pt-8">
          <div className="flex flex-col">
            <div
              className="flex justify-end items-end pb-10 "
              onClick={toggleMenuOff}
            >
              <Close />
            </div>

            <div className="flex flex-col items-center text-white ">
              {links.map(({ name, href }, i) => {
                return (
                  <Link
                    key={i}
                    href={href}
                    className="text-xl font-medium pb-7"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>

            <div className=" gap-5 flex justify-center items-center md:hidden pt-12">
              <button
                onClick={() => router.push("/home")}
                className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
              >
                Sign up
              </button>

              <button
                onClick={() => router.push("/home")}
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
