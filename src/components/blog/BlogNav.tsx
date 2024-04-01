"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BlogNav() {
  const pathname = usePathname();
  const links = [
    {
      name: "All",
      href: "/blog/all",
    },
    {
      name: "Event Tips",
      href: "",
    },
    {
      name: "Product Update",
      href: "",
    },
    {
      name: "Guides And Tutorials",
      href: "",
    },
    {
      name: "Case Study",
      href: "",
    },
  ];

  return (
    <div className=" border-b-[1px] border-gray-300 hidden lg:block">
      <div className="flex items-center text-gray-500 cursor-pointer max-w-5xl mx-auto space-x-24 px-5">
        {links.map(({ name, href }, index) => {
          return (
            <Link
              key={index}
              href={href}
              className={` ${
                pathname === href
                  ? "text-zikoroBlue"
                  : "text-[15px] font-normal py-5 uppercase"
              }`}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
