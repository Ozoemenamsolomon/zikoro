"use client";
import { TLink } from "@/types/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const PeopleLinks: TLink[] = [
  {
    name: "Event",
    href: "event",
  },
  {
    name: "Contact",
    href: "contact",
  },
  {
    name: "Certificate",
    href: "certificate",
  },
  {
    name: "Badge",
    href: "badge",
  },
  {
    name: "Discount",
    href: "discount",
  },
];

const People = ({ children }: { children: React.ReactNode }) => {
  const currentLink = usePathname().split("/").pop();

  return (
    <>
      <section className="bg-white py-4 space-y-4">
        <nav className="px-1 flex justify-between items-center">
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
    </>
  );
};

export default People;
