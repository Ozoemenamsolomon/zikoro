"use client";
import React from "react";
import Link from "next/link";
import { links } from "./Sidebar";
import { usePathname } from "next/navigation";

export const NavLinks = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap gap-4">
      {links.map(({ href, name, icon: Icon }) => {
        return (
          <Link
            href={href}
            className={`p-4 flex flex-nowrap ${
              pathname === href
                ? "text-orange-500 border-l-2 border-orange-500 bg-orangebg "
                : "text-black hover:bg-orangebg"
            }`}
          >
            {Icon && <Icon className="w-6 h-6 mr-2" />}
            <p className="whitespace-nowrap">{name}</p>
          </Link>
        );
      })}
    </div>
  );
};
