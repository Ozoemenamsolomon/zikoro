"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Topbar = ({ eventId }: { eventId?: string }) => {
  const pathname = usePathname();
  //const currentLink = pathnames[pathnames.length - 2];

  const links = [
    {
      name: "Home",
      href: `/events/home/${eventId}`,
    },
    {
      name: "Contents",
      href: `/events/content/${eventId}/partners`,
    },
    {
      name: "People",
      href: "/people/all",
    },
    {
      name: "Agenda",
      href: "/agenda",
    },
    {
      name: "Partners",
      href: `/events/partners/${eventId}`,
    },
    {
      name: "Market Place",
      href: `/events/market-place/${eventId}/jobs`,
    },

    {
      name: "Documents",
      href: "/documents",
    },
    {
      name: "Analytics",
      href: "/analytics",
    },
    {
      name: "Settings",
      href: "/settings",
    },
  ];

  return (
    <nav className="bg-white w-full px-4 pt-4 h-max border-b-[1px]">
      <ul className="flex justify-between text-gray-700">
        {links.map(({ name, href }) => {
          return (
            <li
              className={`pb-1 text-sm ${
                pathname === href
                  ? "text-zikoro border-b-2 border-zikoro font-medium"
                  : ""
              }`}
            >
              <Link href={href}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { Topbar };
