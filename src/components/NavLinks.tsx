"use client";
import React from "react";
import Link from "next/link";
import { links } from "@/constants";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib";
import { Button } from "@/components"

export const NavLinks = ({ query }: { query: string | null }) => {
  const { id } = useParams()
  const pathname = usePathname();


  return (
    <ul className="flex flex-col gap-y-1 items-start  justify-start w-full">
      {links.map(({ href, name, icon: Icon }, idx) => {

        if (idx === links.length - 1) {
          return (
            <li key={name} className={cn("h-fit w-full", query === null && "hidden")}>
              <Button
                className={cn(
                  "p-3 px-4 flex  items-center justify-start gap-x-2  w-full",
                  href === pathname &&
                  "text-zikoro  bg-zikoro border-l-4 border-zikoro bg-opacity-10  "
                )}
              >
                {Icon && <Icon color={href === pathname ? "#001FCC" : "black"} />}
                <span>{name}</span>
              </Button>
              <ul className="w-full flex flex-col gap-y-1 pl-12 text-xs sm:text-sm items-start justify-start">
                <li className="w-full">
                  <Link href={`${href}/${id}?organization=${query}`}>{query}</Link>
                </li>

              </ul>
            </li>
          )
        }
        else {
          return (
            <li key={name} className="w-full">
              <Link
                href={href === "/events" ? `${href}/organization/${id}?organization=${query}` : href}
                className={cn(
                  "p-3 px-4 flex  items-center gap-x-2  w-full",
                  href === pathname || pathname.includes("events") &&
                  "text-zikoro  bg-zikoro border-l-4 border-zikoro bg-opacity-10  ",
                  query === null && href === "/events" && "hidden"
                )}
              >
                {Icon && <Icon color={href === pathname ? "#001FCC" : "black"} />}
                <span>{name}</span>
              </Link>
            </li>
          );
        }

      })}
    </ul>
  );
};
