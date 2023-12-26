"use client";
import * as React from "react";
import { Eye } from "styled-icons/evil";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";
import { AddToQueue } from "@styled-icons/boxicons-regular/AddToQueue";
import { Trash } from "@styled-icons/boxicons-regular/Trash";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home({ children }: { children?: React.ReactNode }) {
  const links = [
    {
      name: "Event",
      href: "/content",
    },
    {
      name: "Contact",
      href: "/content/contact",
    },
    {
      name: "Certificate",
      href: "/content/certificate",
    },
    {
      name: "Badge",
      href: "/content/badge",
    },
    {
      name: "Discount",
      href: "/content/discount",
    },
  ];
  const pathname = usePathname();

  return (
    <div className="w-[100%] h-[100%] bg-white border-8 border-r-0 border-b-0 border-basebody py-2">
      <main className="my-4 rounded-md">
        <div className="p-4 text-base flex items-center justify-between text-black ">
          <div className="flex items-center font-medium justify-center space-x-8 text-[14px]">
            {links.map(({ name, href }, index) => {
              return (
                <Link
                  href={href}
                  key={index}
                  className={` ${
                    pathname === href ? "text-purplebg" : "text-[#717171]"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </div>

          {pathname === "/content/certificate" ||
          "/content/badge" ||
          "/content/discount" ? null : (
            <div className="flex items-center justify-center space-x-6">
              <div className="space-x-2 flex items-center justify-center text-[14px]">
                <button
                  className="w-[120px] flex justify-center items-center bg-purplebg text-white py-[10px] rounded-[5px]"
                  type="submit"
                  form="form"
                >
                  <span className="mr-2">Preview</span>
                  <Eye size={25} />
                </button>
                <button
                  form="form"
                  type="submit"
                  className="w-[120px] flex justify-center items-center text-purplebg border-[1px] border-purplebg py-[9px] rounded-[5px]"
                >
                  <span className="mr-2">Publish</span>
                  <UploadOutline size={20} />
                </button>
              </div>
              <div className="flex justify-center items-center space-x-4 text-[#717171]">
                <button className="text-center text-[14px]">
                  <span className="pr-[2px] ">Saved</span>
                  <Check size={20} className="text-purplebg" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 my-6 mx-10 border-2 rounded-md border-[#f3f3f3]">
          {children}
        </div>
      </main>
    </div>
  );
}
