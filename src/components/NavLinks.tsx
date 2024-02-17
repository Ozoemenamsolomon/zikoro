"use client";

import React from "react";
import Link from "next/link";
import { links } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { Button } from "@/components";

export const NavLinks = ({
  query,
  id,
  eventId,
  onClose,
  onOpen,
}: {
  id: string | string[];
  query: string | null;
  onClose:() => void
  onOpen:()=> void
  eventId?:string
}) => {
  const pathname = usePathname();


 
  return (
      <ul className="flex flex-col gap-y-1 items-start h-[75%] pb-32  no-scrollbar overflow-y-auto  justify-start w-full">
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
                      "text-zikoro  bg-zikoro border-l-4 border-zikoro bg-opacity-10  "
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
          else if (idx === links.length - 2) {
           return  (
            
            <li
            key={name}
            className={cn("h-fit w-full")}
          >
            <Button
              onClick={onOpen}
              className={cn(
                "p-3 px-4 flex  items-center justify-start gap-x-2  w-full",
                pathname.includes(href) &&
                  "text-zikoro  bg-zikoro border-l-4 border-zikoro bg-opacity-10  "
              )}
            >
              {Icon && (
                <Icon color={href === pathname ? "#001FCC" : "black"} />
              )}
              <span>{name}</span>
            </Button>
           
             
        
          </li>
           )
          }
          else {
            return (
              <li key={name} className="w-full">
                <Link
                  href={
                    href === "/published-events"
                      ? `${href}/organization/${id}?organization=${query}`
                      : href
                  }
                  target={href === "/published-events" ? "blank" : ""}
                  className={cn(
                    "p-3 px-4 flex  items-center gap-x-2  w-full",
                    href === pathname &&
                      "text-zikoro  bg-zikoro border-l-4 border-zikoro bg-opacity-10  ",
                    query === null && href === "/published-events" && "hidden"
                  )}
                >
                  {Icon && (
                    <Icon color={href === pathname ? "#001FCC" : "black"} />
                  )}
                  <span>{name}</span>
                </Link>
              </li>
            );
          }
        })}
      </ul>

  );
};
