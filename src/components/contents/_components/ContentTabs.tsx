"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components";
import { useState } from "react";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { AddPartners } from "@/components/partners/_components";
export function ContentTabs({eventId, refetch}:{eventId:string, refetch:any;}) {
  const pathname = usePathname()
 
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

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
      href:   `/events/content/${eventId}/partners`,
    },
  ];
  

  return (

    <>
        <nav className="bg-white w-full flex items-center justify-between px-4 py-4 h-max border-b-[1px]">
      <ul className="flex gap-x-6 text-gray-700">
        {links.map(({ name, href }) => {
          return (
            <li
              className={`pb-1 text-sm ${
                pathname === href
                  ? "text-zikoro  font-medium"
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

    {isOpen && (
        <AddPartners refetchPartners={refetch} close={onClose} eventId={eventId}  />
      )}
    </>
  );
}
