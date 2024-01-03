"use client";
import { Toaster } from "@/components/ui/toaster";
import { TLink } from "@/types/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
