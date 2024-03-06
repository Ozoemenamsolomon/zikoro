"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MarketPlaceTab({eventId}:{eventId?:string}) {
  const pathname = usePathname();
  const links = [
    {
      href: `/events/market-place/${eventId}/jobs`,
      name: "Jobs",
    },
    {
      href: `/events/market-place/${eventId}/offers`,
      name: "Offers",
    },
    {
      href: `/events/market-place/${eventId}/rewards`,
      name: "Rewards",
    },
  ];
  return (
    <ul className="py-4 flex gap-x-6 px-3 text-gray-700">
      {links.map(({ name, href }) => {
        return (
          <li
            className={`pb-1 text-sm ${
              pathname === href ? "text-zikoro  font-medium" : ""
            }`}
          >
            <Link href={href}>{name}</Link>
          </li>
        );
      })}
    </ul>
  );
}
