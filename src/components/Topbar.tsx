"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Topbar = ({ eventId }: { eventId?: string | string[] }) => {
  const pathname = usePathname();
  //const currentLink = pathnames[pathnames.length - 2];

  const links = [
    {
      name: "Reception",
      href: `${eventId}/home`,
    },
    {
      name: "Contents",
      href: `${eventId}/content/info`,
    },
    {
      name: "People",
      href: `${eventId}/people/all`,
    },
    {
      name: "Agenda",
      href: `${eventId}/agenda`,
    },
    {
      name: "Partners",
      href: `${eventId}/partners?p=sponsors`,
    },
    {
      name: "Market Place",
      href: `${eventId}/market-place/jobs`,
    },

    {
      name: "Interactions",
      href: `${eventId}/interaction/stamp-card`,
    },
    {
      name: "Analytics",
      href: `${eventId}/analytics`,
    },
    {
      name: "Settings",
      href: `${eventId}/settings`,
    },
  ];

  return (
    <nav className="w-full overflow-x-auto no-scrollbar">
      <div className="bg-white min-w-[900px] px-4 pt-2 h-max border-b">
        <ul className="flex justify-between text-gray-700">
          {links.map(({ name, href }) => {
            return (
              <li
                className={`pb-1 text-xs md:text-sm ${
                  pathname.includes(`${href.split("/")[1]}`)
                    ? "text-basePrimary border-b-2 border-basePrimary font-medium"
                    : ""
                }`}
              >
                <Link href={`/event/${href}`}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export { Topbar };
