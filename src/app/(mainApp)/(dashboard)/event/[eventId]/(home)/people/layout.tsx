"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { PeopleLinks } from "@/data/LayoutLinks";
import { getCookie, useGetEvent } from "@/hooks";
import { Event, TUser } from "@/types";

const People = ({ children }: { children: React.ReactNode }) => {
  const pathNames = usePathname().split("/");

  useEffect(() => {}, [pathNames]);

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
      <section className="bg-white">
        <nav className="flex justify-between items-center w-full overflow-x-auto no-scrollbar border-b md:border-b-0">
          <ul className="px-8 pl-[60px] lg:pl-[30px] py-5 flex items-center font-normal gap-x-8 text-sm">
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
