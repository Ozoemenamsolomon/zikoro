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
      href: "/blog/event-tips",
    },
    {
      name: "Product Update",
      href: "/blog/product-update",
    },
    {
      name: "Guides And Tutorials",
      href: "/blog/guides",
    },
    {
      name: "Case Study",
      href: "/blog/case-study",
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
              className={`uppercase ${
                pathname === href
                  ? "text-zikoroBlue"
                  : "text-[15px] font-normal py-5 "
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
