"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ContentTopNav({ eventId }: { eventId: string | string[] }) {
  
  const links = [
    {
      name: "Info",
      href: `info`,
    },
    {
      name: "Contact",
      href: `contact`,
    },
    {
      name: "Discount",
      href: `discount`,
    },
    {
      name: "Badge",
      href: `badge`,
    },
    {
      name: "Certificate",
      href: `certificate`,
    },
    {
      name: "Partners",
      href: `partners`,
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
              href={`/event/${eventId}/content/${href}`}
              key={index}
              className={`pl-2 ${
                pathname.includes(href) && "text-basePrimary"
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
