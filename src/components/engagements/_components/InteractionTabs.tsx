"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function InteractionTabs({ eventId }: { eventId: string }) {
  const pathname = usePathname();

  const links = [
    {
      name: "Interactions",
      href: "interaction",
    },
    {
      name: "StampCard",
      href: `stamp-card`,
    },
    {
      name: "Settings",
      href: `settings`,
    },
  ];

  /**
       {
      name: "Photos",
      href: "photos",
    },
    {
      name: "Social Wall",
      href: "social-wall",
    },
    {
      name: "LeaderBoard",
      href: "leaderboard",
    },
   */

  return (
    <>
      <nav className="bg-white w-full flex pl-[60px] lg:pl-[28px] overflow-x-auto no-scrollbar items-center justify-between px-4 py-4 h-max border-b">
        <ul className="flex gap-x-8 text-gray-700">
          {links.map(({ name, href }, index) => {
            return (
              <li
                key={index}
                className={` text-sm ${
                  pathname.includes(href) ? "text-basePrimary  font-medium" : ""
                }`}
              >
                <Link
                  href={`/event/${eventId}/engagements/${href}`}
                  className="whitespace-nowrap"
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
