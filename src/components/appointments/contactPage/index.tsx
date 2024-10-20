import React from "react";
import ContactList from "./ContactList";
import ContactNav from "./ContactNav";
import { BookingsContact } from "@/types/appointments";

type ContactProps = {
  children: React.ReactNode;
  data: BookingsContact[] | null
  searchquery?: string;
};

const ContactLayout: React.FC<ContactProps> = async ({ children, data, searchquery }) => {
  return (
    <div className=" ">
      <h4 className="text-lg font-semibold pb-4">Contacts</h4>
      <div className="sm:border rounded-lg bg-white">
          <div className="w-full">
            <ContactNav/>
          </div>

          <div className="flex flex-col md:flex-row md:divide-x">
            <ContactList fetchedcontacts={data} searchquery={searchquery} />

            <div className="w-full md:w-3/4 h-full">
                {children}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ContactLayout;
