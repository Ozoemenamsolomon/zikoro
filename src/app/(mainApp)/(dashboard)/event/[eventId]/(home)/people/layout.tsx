"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { PeopleLinks } from "@/data/LayoutLinks";
import { getCookie, useGetEvent } from "@/hooks";
import { Event, TUser } from "@/types";

const People = ({ children }: { children: React.ReactNode }) => {
  const pathNames = usePathname().split("/");

  useEffect(() => {
    
  }, [pathNames]);

  const user = getCookie<TUser>("user");
  // const event = getCookie<Event>("event");
  const { eventId } = useParams();

  if (!user) return;

  const { event, getEvent, isLoading } = useGetEvent({
    eventId,
    isAlias: true,
  });

  

  console.log(
    String(event?.createdBy),
    String(user.id),
    String(event?.createdBy) !== String(user.id)
  );

  return (
    <>
      <section className="bg-white md:py-4 md:space-y-4">
        <nav className="flex justify-between items-center w-full overflow-x-auto no-scrollbar border-b-2 md:border-b-0 border-[#F3F3F3]">
          <ul className="px-4 pt-4 md:pt-2 pb-4 md:pb-0 flex items-center font-normal gap-x-8 text-sm">
            {PeopleLinks.map(({ href, name, hideFromAttendee }) => (
              <li
                key={name}
                className={`w-full flex-1 whitespace-nowrap capitalize ${
                  pathNames.includes(href)
                    ? "text-basePrimary"
                    : "text-gray-700"
                } ${
                  hideFromAttendee &&
                  user &&
                  String(event?.createdBy) !== String(user.id)
                    ? "hidden"
                    : ""
                }`}
              >
                <Link href={href}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </section>
    </>
  );
};

export default People;
