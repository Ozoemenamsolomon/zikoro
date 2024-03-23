"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ContentTopNav({ eventId }: { eventId: string | string[] }) {
  const links = [
    {
      name: "Info",
      href: `/event/content/${eventId}/info`,
    },
    {
      name: "Contact",
      href: `/event/content/${eventId}/contact`,
    },
    {
      name: "Discount",
      href: `/event/content/${eventId}/discount`,
    },
    {
      name: "Badge",
      href: `/event/content/${eventId}/badge`,
    },
    {
      name: "Certificate",
      href: `/event/content/${eventId}/certificate`,
    },
    {
      name: "Partners",
      href: `/event/content/${eventId}/partners`,
    },
  ];
  const pathname = usePathname();
  //  const [isSaved, setIsSaved] = useState<boolean>(true);
  return (
    <div className="w-full overflow-x-auto no-scrollbar  p-4 text-base flex items-center justify-between text-[#3E404B] border-b border-basebody">
      <div className="flex items-center font-normal justify-center gap-x-8 text-sm">
        {links.map(({ name, href }, index) => {
          return (
            <Link
              href={href}
              key={index}
              className={`pl-2 ${
                pathname.includes(name.toLowerCase()) && "text-zikoro"
              }`}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
