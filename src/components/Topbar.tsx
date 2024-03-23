"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Topbar = ({ eventId }: { eventId?: string | string[] }) => {
  const pathname = usePathname();
  //const currentLink = pathnames[pathnames.length - 2];

  const links = [
    {
      name: "Reception",
      href: `/event/home/${eventId}`,
    },
    {
      name: "Contents",
      href: `/event/content/${eventId}/info`,
    },
    {
      name: "People",
      href: `/event/people/all/${eventId}`,
    },
    {
      name: "Agenda",
      href: `/event/agenda/${eventId}`,
    },
    {
      name: "Partners",
      href: `/event/partners/${eventId}?p=sponsors`,
    },
    {
      name: "Market Place",
      href: `/event/market-place/${eventId}/jobs`,
    },

    {
      name: "Interactions",
      href: `/event/interaction/${eventId}/stamp-card`,
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
           
            return (
              <li
                className={`pb-1 text-sm ${
                  pathname.includes(
                    `${href.split("/")[1]}/${href.split("/")[2]}`
                  )
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
