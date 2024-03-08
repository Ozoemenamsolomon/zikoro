"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Topbar = ({ eventId }: { eventId?: string }) => {
  const pathname = usePathname();
  //const currentLink = pathnames[pathnames.length - 2];

  const links = [
    {
      name: "Reception",
      href: `/events/home/${eventId}`,
    },
    {
      name: "Contents",
      href: `/events/content/${eventId}/info`,
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
      name: "Interactions",
      href: `/events/interaction/${eventId}/stamp-card`,
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
    <nav className="w-full overflow-x-auto no-scrollbar">
      <div className="bg-white min-w-[900px] px-4 pt-2 h-max border-b">
        <ul className="flex justify-between text-gray-700">
          {links.map(({ name, href }) => {
            console.log(href.split("/"))
            return (
              <li
                className={`pb-1 text-sm ${
                  pathname.includes(href.split("/")[2])
                    ? "text-zikoro border-b-2 border-zikoro font-medium"
                    : ""
                }`}
              >
                <Link href={href}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export { Topbar };
