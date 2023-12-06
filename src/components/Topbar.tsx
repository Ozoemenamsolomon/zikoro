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
    <div className="bg-white w-full flex gap-12 text-gray-500">
      {links.map(({ name, href }) => {
        return (
          <Link
            href={href}
            className={` ${
              pathname === href
                ? "text-orange-500 border-b-2 border-orange-500"
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
