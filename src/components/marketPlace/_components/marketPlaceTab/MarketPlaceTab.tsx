"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MarketPlaceTab({eventId}:{eventId?:string}) {
  const pathname = usePathname();
  const links = [
    {
      href: `jobs`,
      name: "Jobs",
    },
    {
      href: `offers`,
      name: "Offers",
    },
    {
      href: `rewards`,
      name: "Rewards",
    },
    {
      href: `stamp-card`,
      name: "StampCard",
    },
  ];
  return (
    <ul className="py-4 pl-[60px] lg:pl-[20px] flex gap-x-8 px-4 text-gray-700">
      {links.map(({ name, href }, index) => {
        return (
          <li
          key={index}
            className={` text-sm ${
              pathname.includes(href) ? "text-basePrimary  font-medium" : ""
            }`}
          >
            <Link href={`/event/${eventId}/market-place/${href}`}>{name}</Link>
          </li>
        );
      })}
    </ul>
  );
}
