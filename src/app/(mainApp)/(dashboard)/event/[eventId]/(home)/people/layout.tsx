"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { PeopleLinks } from "@/data/LayoutLinks";

const People = ({ children }: { children: React.ReactNode }) => {
  const pathNames = usePathname().split("/");

  useEffect(() => {
    console.log(pathNames);
  }, [pathNames]);

  return (
    <>
      <section className="bg-white md:py-4 md:space-y-4">
        <nav className="px-1 flex justify-between items-center">
          <ul className="md:flex gap-8 px-4 hidden">
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
