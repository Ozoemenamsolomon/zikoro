"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Content",
    href: "content",
  },
  {
    name: "People",
    href: "people/all",
  },
  {
    name: "Agenda",
    href: "agenda",
  },
  {
    name: "Partners",
    href: "partners",
  },
  {
    name: "Products",
    href: "products",
  },
  {
    name: "Interactions",
    href: "interactions",
  },
  {
    name: "Documents",
    href: "documents",
  },
  {
    name: "Analytics",
    href: "analytics",
  },
  {
    name: "Settings",
    href: "settings",
  },
  
];

const Topbar = () => {
  const pathnames = usePathname().split("/");
  const currentLink = pathnames[pathnames.length - 2];

  return (
    <div className="bg-white w-full pt-4 flex gap-12 text-gray-500 sticky top-0 z-10">
      {links.map(({ name, href }) => {
        return (
          <Link
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
