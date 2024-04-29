"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getCookie, useCheckTeamMember } from "@/hooks";
import { AccessVerification } from "./composables";

const Topbar = ({ eventId }: { eventId?: string | any }) => {
  const pathname = usePathname();
  const user = getCookie("user")
  const {isIdPresent} =useCheckTeamMember({eventId})


  
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

  const hideFromAttendee = ["Contents", "Analytics", "Settings"];
  const set = new Set(hideFromAttendee);

  const reformedLink = useMemo(() => {
    return links.filter((link) => {
      if (!user || !user?.userEmail || !isIdPresent) {
        return !set.has(String(link?.name));
      } else {
        return links;
      }
    });
  }, [user, isIdPresent]);

  return (
    <>
      <nav className="w-full overflow-x-auto no-scrollbar">
        <div className="bg-white min-w-[900px] px-4 pt-2 h-max border-b">
          <ul className="flex justify-between text-gray-700">
            {reformedLink.map(({ name, href }) => {
              //  console.log(href.split("/")[1].split("?"))
              return (
                <li
                  className={`pb-1 text-sm ${
                    pathname.includes(
                      `${href.split("/")[1].split("?")[0]}` ||
                        `${href.split("/")[1]}`
                    )
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
      {/**
          <AccessVerification
        eventLoading={eventLoading}
        isEventIdPresent={isIdPresent}
        id={eventId}
      />
         */}
    </>
  );
};

export { Topbar };
