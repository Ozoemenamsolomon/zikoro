// @ts-nocheck
"use client";
import React from "react";
import Link from "next/link";
import { links } from "./";
import { usePathname } from "next/navigation";

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap gap-4">
      {links.map(({ href, name, icon: Icon }) => {
        return (
          <Link
            href={href}
            className={`p-4 flex gap-2 items-center ${
              pathname === href
                ? "text-orange-500 border-l-2 border-orange-500 bg-orangebg "
                : ""
            }`}
          >
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            {name}
          </Link>
        );
      })}
    </div>
  );
};
