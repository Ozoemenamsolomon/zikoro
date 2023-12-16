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
    href: "people",
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
  const pathnameArr = usePathname().split("/");
  const currentLink = pathnameArr[pathnameArr.length - 2];

  return (
    <nav className="bg-white w-full sticky top-0 px-4 pt-4 h-max">
      <ul className="flex justify-between text-slate-700">
        {links.map(({ name, href }) => {
          return (
            <li
              className={`pb-1 text-sm ${
                currentLink === href
                  ? "text-basePrimary border-b-2 border-basePrimary font-medium"
                  : ""
              }`}
            >
              <Link href={"/" + href}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Topbar;
