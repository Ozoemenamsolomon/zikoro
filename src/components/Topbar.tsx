"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { getCookie, useGetUserHomePageEvents } from "@/hooks";
import { AccessVerification } from "./composables";

const Topbar = ({ eventId }: { eventId?: string | string[] }) => {
  const pathname = usePathname();
  const user = getCookie("user");
  const { events, loading: eventLoading } = useGetUserHomePageEvents();
  const [isIdPresent, setIsIdPresent] = useState(false);
  //const currentLink = pathnames[pathnames.length - 2];

  useEffect(() => {
    if (events && !eventLoading) {
      //checked if the eventid is present in the event array
      const isEventIdPresent = events?.some(({ eventAlias }) => eventAlias === eventId);
 
      setIsIdPresent(isEventIdPresent);
    }
  }, [events, eventLoading]);
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

  const hideFromAttendee = ["Contents", "Analytics", "Settings"]
  const set = new Set(hideFromAttendee)
 
  const reformedLink = useMemo(() => {
    return links.filter((link) => {
      if (!user || !user?.userEmail || !isIdPresent) {
        return  !set.has(String(link?.name));
      }
      else {
        return links
      }

     
    });
  }, [user, isIdPresent]);

  return (
    <>
      <nav className="w-full overflow-x-auto no-scrollbar">
        <div className="bg-white min-w-[900px] px-4 pt-2 h-max border-b">
          <ul className="flex justify-between text-gray-700">
            {reformedLink.map(({ name, href }) => {
              return (
                <li
                  className={`pb-1 text-sm ${
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
