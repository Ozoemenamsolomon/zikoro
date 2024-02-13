"use client";
import React from "react";
import Link from "next/link";
import { links } from "./Sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const NavLinks = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap gap-4 w-[250px]">
      {links.map(({ href, name, icon }, index) => {
        return (
          <Link
            href={href}
            key={index}
            className={`p-4 flex items-center text-[#15161B] text-base ${
              pathname === href
                ? "text-bluebg border-l-2 border-bluebg bg-[#EEF0FF]"
                : ""
            }`}
          >
            {icon && (
              <Image
                src={icon}
                className="mr-2"
                alt="icon"
                width={20}
                height={20}
              />
            )}
            {name}
          </Link>
        );
      })}
    </div>
  );
};
