"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function InteractionTabs({ eventId }: { eventId: string }) {
  const pathname = usePathname();

  const links = [
    {
      name: "Discussions",
      href: `discussion`,
    },
    {
      name: "Photos",
      href: "photos",
    },
    {
      name: "Social Wall",
      href: "social-wall",
    },
    {
      name: "StampCard",
      href: `stamp-card`,
    },
    {
      name: "LeaderBoard",
      href: "leaderboard",
    },
    {
      name: "Quiz",
      href:"quiz"
    }
  ];

  return (
    <>
      <nav className="bg-white w-full flex overflow-x-auto no-scrollbar items-center justify-between px-4 py-4 h-max border-b">
        <ul className="flex gap-x-9 text-gray-700">
          {links.map(({ name, href }) => {
            return (
              <li
                className={`pb-1 text-sm ${
                  pathname.includes(href) ? "text-basePrimary  font-medium" : ""
                }`}
              >
                <Link href={`/event/${eventId}/interaction/${href}`} className="whitespace-nowrap">{name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
