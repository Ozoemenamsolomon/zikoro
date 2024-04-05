"use client";
import React from "react";
import Link from "next/link";
import { links } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { Button } from "@/components";

export const NavLinks = ({
  query,
  id
}: {
  id: string | string[];
  query: string | null;
}) => {
  const pathname = usePathname();

  return (
    <ul className="flex text-mobile sm:text-sm flex-col gap-y-1 items-start h-[45vh] pb-32 overflow-hidden  no-scrollbar overflow-y-auto  justify-start w-full">
    {links.map(({ href, name, icon: Icon }, idx) => {
      if (idx === links.length - 1) {
      
        return (
          <li
            key={name}
            className={cn("h-fit w-full", query === null && "hidden")}
          >
            <Button
              className={cn(
                "p-3 px-4 flex  items-center justify-start gap-x-2  w-full",
                pathname.includes(href) &&
                  "text-basePrimary  bg-basePrimary border-l-4 border-basePrimary bg-opacity-10  "
              )}
            >
              {Icon && (
                <Icon color={href === pathname ? "#001FCC" : "black"} />
              )}
              <span>{name}</span>
            </Button>

            <ul className="w-full flex flex-col gap-y-1 pl-12 text-xs sm:text-sm items-start justify-start">
              <li className="w-full">
                <Link href={`${href}/${id}?organization=${query}`}>
                  {query}
                </Link>
              </li>
            </ul>
          </li>
        );
      }


      return (
        <li key={name} className="w-full">
          <Link
            href={
              href === "/live-events"
                ? `${href}/organization/${id}?organization=${query}`
                : href
            }
            target={href === "/live-events" ? "blank" : ""}
            className={cn(
              "p-3 pr-4 pl-4 flex  items-center gap-x-2  w-full",
              href === pathname &&
                "text-basePrimary pl-2 pr-4  bg-basePrimary border-l-4 border-basePrimary bg-opacity-10  ",
              query === null && href === "/live-events" && "hidden"
            )}
          >
            {Icon && <Icon color={href === pathname ? "#001FCC" : "black"} />}
            <span>{name}</span>
          </Link>
        </li>
      );
    })}
  </ul>
  );
};
