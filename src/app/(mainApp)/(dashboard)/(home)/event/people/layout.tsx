"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { TLink } from "@/components/Sidebar";

const PeopleLinks: TLink[] = [
  { name: "All", href: "all" },
  { name: "released certificates", href: "released_certificates" },
  { name: "favorites", href: "favorites" },
  { name: "tags", href: "tags" },
  { name: "notes", href: "notes" },
  { name: "invites", href: "invites" },
];

const People = ({ children }: { children: React.ReactNode }) => {
  const pathNames = usePathname().split("/");

  useEffect(() => {
    console.log(pathNames);
  }, [pathNames]);

  return (
    <>
      <section className="bg-white py-4 space-y-4">
        <nav className="px-1 flex justify-between items-center">
          <ul className="flex gap-8 px-4">
            {PeopleLinks.map(({ href, name }) => (
              <li
                key={name}
                className={`text-sm capitalize ${
                  pathNames.includes(href)
                    ? "text-basePrimary"
                    : "text-gray-700"
                }`}
              >
                <Link href={href}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </section>
    </>
  );
};

export default People;
