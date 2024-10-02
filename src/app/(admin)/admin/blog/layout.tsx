"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/admin/blog/dashboard",
    },
    // {
    //   name: "Categories",
    //   href: "/admin/blog/categories",
    // },
    {
      name: "Create New Post",
      href: "/admin/blog/create",
    },
    {
      name: "Draft",
      href: "/admin/blog/draft",
    },
    {
      name: "Scheduled",
      href: "/admin/blog/scheduled",
    },
  ];

  return (
    <>
      <main className={``}>
        {/* Nav */}
        <nav className="w-full fixed top-0 ">
          <div className="bg-white min-w-0 lg:min-w-[900px] px-3 lg:px-10 pt-5  h-max border-b overflow-x-auto lg:overflow-x-hidden no-scrollbar ">
            <ul className="flex gap-x-16 text-gray-700">
              {links.map(({ name, href }, index) => {
                return (
                  <li
                    key={index}
                    className={`text-[12px] lg:text-sm whitespace-nowrap pr-3 lg:pr-0 ${
                      pathname === href
                        ? "text-basePrimary pb-5 border-b-2 border-basePrimary font-medium "
                        : ""
                    }`}
                  >
                    <Link href={href}>{name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        {/* body */}
        <div className="bg-gray-50 ">{children}</div>
      </main>
    </>
  );
}
