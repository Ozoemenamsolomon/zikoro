"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useDisclose from "@/hooks/common/useDisclose";
import { ContentSetting } from ".";
import { Settings } from "@styled-icons/feather/Settings";

export function ContentTopNav({ eventId }: { eventId: string | string[] }) {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclose();
  const links = [
    {
      name: "Info",
      href: `info`,
    },
    {
      name: "Contact",
      href: `contact`,
    },
    {
      name: "Discount",
      href: `discount`,
    },
    {
      name: "Badge",
      href: `badge`,
    },
    {
      name: "Certificate",
      href: `certificate`,
    },
    {
      name: "Partners",
      href: `partners`,
    },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto no-scrollbar pl-[60px] lg:pl-0 py-3  px-4 text-base flex items-center gap-x-8 sm:justify-between text-[#3E404B] border-b border-basebody">
        <div className="flex items-center font-normal justify-center gap-x-8 text-sm">
          {links.map(({ name, href }, index) => {
            const path = pathname.split("/");
            console.log(path.length, pathname.split("/")[path.length - 1])
            return (
              <Link
                href={`/event/${eventId}/content/${href}`}
                key={index}
                className={`pl-2 ${
                  pathname.split("/")[path.length - 1] === href &&
                  "text-basePrimary"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </div>

        <button
          onClick={onOpen}
          className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1"
        >
          <Settings size={22} />
        </button>
      </div>

      {isOpen && <ContentSetting onClose={onClose} eventId={eventId} />}
    </>
  );
}
