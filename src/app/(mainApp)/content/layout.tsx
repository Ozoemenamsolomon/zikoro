"use client";
import { ContentLinks } from "@/data/LayoutLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

const People = ({ children }: { children: React.ReactNode }) => {
  const currentLink = usePathname().split("/").pop();

  return (
    <>
      <section className="bg-white py-4 space-y-4">
        <nav className="px-1 flex justify-between items-center">
          <ul className="flex gap-8 px-4">
            {ContentLinks.map(({ href, name }) => (
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
