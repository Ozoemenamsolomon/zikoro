"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { manrope } from "../utils/fonts";

const links = [
  {
    name: "Content",
    href: "/content",
  },
  {
    name: "People",
    href: "/people",
  },
  {
    name: "Agenda",
    href: "/agenda",
  },
  {
    name: "Partners",
    href: "/partners",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Interactions",
    href: "/interactions",
  },
  {
    name: "Documents",
    href: "/documents",
  },
  {
    name: "Analytics",
    href: "/analytics",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];

const Topbar = () => {
  const pathname = usePathname();
  return (
    <div className="px-4 bg-white w-full items-center flex gap-12 text-gray-500 sticky top-0 text-[16px] z-50">
      {links.map(({ name, href }, index) => {
        return (
          <Link
            href={href}
            key={index}
            className={`p-2 font-medium  ${manrope.className} ${
              pathname.includes(href)
                ? "text-bluebg font-medium border-b border-bluebg"
                : "font-normal"
            }`}
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
};

export default Topbar;
