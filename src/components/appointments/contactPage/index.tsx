"use client";

import Link from "next/link";
import React, { Suspense, useState } from "react";
import { ContactDummy, contactNav, contactNavSub } from "./constants";
import { Heart, Search } from "lucide-react";
import ContactList from "./ContactList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Articleone from "./Articleone";
import ArticleTwo from "./ArticleTwo";

type ContactProps = {
  contacts: ContactDummy[];
  searchParams: { query: string };
};

const ContactLayout: React.FC<ContactProps> = ({
  contacts,
  searchParams: { query: searchQuery },
}) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const [contact, setContact] = useState<ContactDummy>(contacts[0]);
  return (
    <div className=" ">
      <h4 className="text-lg font-semibold pb-4">Contacts</h4>
      <div className="sm:border rounded-lg bg-white">
        <div className="w-full">
          <div className="w-full sticky top-0 overflow-auto no-scrollbar flex gap-3 items-center px-6 py-2 border-b ">
            {contactNav.map(({ label, link }) => (
              <Link
                key={label}
                href={link}
                className={`px-4 py-2 rounded   hover:bg-gray-100 duration-300 ${
                  link === pathname ? "text-basePrimary" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:divide-x">
          <ContactList contacts={contacts} />

          <div className="w-full md:w-3/4 h-full">
            <div className="w-full flex overflow-auto no-scrollbar gap-1 items-center px-6 py-3 border-b border-slate-200   sticky top-0 bg-white z-20">
              {contactNavSub.map(({ label, query }) => (
                <button
                  key={label}
                  onClick={() => push(`${pathname}?query=${query}`)}
                  className={`px-3 py-1 rounded text-nowrap  hover:ring-1 hover:ring-gray-200 duration-300 ${
                    query === searchQuery ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row w-full h-full md:divide-x  ">
              <Articleone contact={contact} />
              <ArticleTwo contact={contact} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactLayout;
