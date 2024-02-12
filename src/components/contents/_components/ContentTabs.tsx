"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components";
import { useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";

const links = [
  {
    name: "Event",
    href: "event",
  },
  {
    name: "Contact",
    href: "contact",
  },
  {
    name: "Certificate",
    href: "certificate",
  },
  {
    name: "Badge",
    href: "badge",
  },
  {
    name: "Discount",
    href: "discount",
  },
  {
    name: "Partners",
    href: "partners",
  },
];

export function ContentTabs() {
  const pathnames = usePathname().split("/");
  const currentLink = pathnames[pathnames.length - 2];
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

  return (
    <nav className="bg-white w-full flex items-center justify-between px-4 pt-4 h-max border-b-[1px]">
      <ul className="flex gap-x-6 text-gray-700">
        {links.map(({ name, href }) => {
          return (
            <li
              className={`pb-1 text-sm ${
                currentLink === href
                  ? "text-zikoro border-b-2 border-zikoro font-medium"
                  : ""
              }`}
            >
              <Link href={"/" + href}>{name}</Link>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={onClose}
        className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
      >
        <PlusCircle size={22} />
        <p>New</p>
      </Button>
    </nav>
  );
}
