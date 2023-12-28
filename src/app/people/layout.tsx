"use client";
import Attendee from "@/components/Attendee";
import AttendeesData from "@/data/AttendeesData";
import { TLink } from "@/types/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export const PeopleLinks: TLink[] = [
  { name: "All", href: "all" },
  { name: "released certificates", href: "released_certificates" },
  { name: "favorites", href: "favorites" },
  { name: "tags", href: "tags" },
  { name: "notes", href: "notes" },
  { name: "invites", href: "invites" },
];

const People = ({ children }: { children: React.ReactNode }) => {
  const currentLink = usePathname().split("/").pop();

  const mappedData = AttendeesData.map((data) => (
    <Attendee
      key={data.id}
      name={data.fullName}
      job={data.job}
      time={data?.time}
      date={data?.date}
      role1={data.role1}
      role2={data?.role2}
    />
  ));

  return (
    <>
      <section className="bg-white py-8 space-y-8">
        <nav className="px-1">
          <ul className="flex gap-8 px-4">
            {PeopleLinks.map(({ href, name }) => (
              <li
                key={name}
                className={`text-sm capitalize ${
                  currentLink === href ? "text-basePrimary" : "text-gray-700"
                }`}
              >
                <Link href={href}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </section>
      <Toaster />
    </>
  );
};

export default People;
