"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="bg-white w-full pt-4 hidden lg:flex gap-12 text-gray-500 sticky top-0 z-10">
      {links.map(({ name, href, }, i) => {
        return (
          <Link
            key={i}
            href={href}
            className={` ${
              pathname === href
                ? "text-zikoroBlue border-b-2 border-zikoroBlue"
                : ""
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
