"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { PeopleLinks } from "@/data/LayoutLinks";
import { getCookie } from "@/hooks";
import { Event, TUser } from "@/types";

const People = ({ children }: { children: React.ReactNode }) => {
  const pathNames = usePathname().split("/");

  useEffect(() => {
    console.log(pathNames);
  }, [pathNames]);

  const user = getCookie<TUser>("user");
  const event = getCookie<Event>("event");

  return (
    <>
      <section className="bg-white md:py-4 md:space-y-4">
        <nav className="px-1 flex justify-between items-center pt-2 w-full overflow-x-auto no-scrollbar">
          <div className="min-w-fit">
            <ul className="flex gap-8 px-4 border-b md:border-b-0 pb-2">
              {PeopleLinks.map(({ href, name, hideFromAttendee }) => (
                <li
                  key={name}
                  className={`w-full flex-1 whitespace-nowrap text-xs md:text-sm capitalize ${
                    pathNames.includes(href)
                      ? "text-basePrimary"
                      : "text-gray-700"
                  } ${
                    !hideFromAttendee ||
                    (user && String(event?.createdBy) === String(user.id))
                  }`}
                >
                  <Link href={href}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {children}
      </section>
    </>
  );
};

export default People;
