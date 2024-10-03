"use client";

import Link from "next/link";
import { cn } from "@/lib";
import { usePathname, useSearchParams } from "next/navigation";

export function EventTopNav({query}) {
  const pathname = usePathname();
  // const search = useSearchParams();
  // const queryParam = search.get("e");

  const links = [
    {
      name: "Review",
      q: `review`,
    },
    {
      name: "New",
      q: `new`,
    },
    {
      name: "Published",
      q: `published`,
    },
  ];
  return (
    <nav className="w-full bg-white px-4 pt-4  border-b-2 ">
      <ul className="px-4 flex items-center gap-x-8 text-gray-700">
        {links.map(({ name, q }) => {
          return (
            <li
              className={cn(
                `pb-1 text-sm`,
                query === q &&
                  "text-basePrimary pb-2 border-b-2 border-basePrimary font-medium",
                !query &&
                  name === "Review" &&
                  "text-basePrimary pb-2 border-b-2 border-basePrimary font-medium"
              )}
            >
              <Link href={`/admin/events?e=${q}`}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
