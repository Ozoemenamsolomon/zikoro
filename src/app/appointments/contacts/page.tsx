import ContactLayout from "@/components/appointments/contactPage";
import React from "react";

const Contacts = ({
  searchParams: { query: searchQuery },
}: {
  searchParams: { query: string };
}) => {
  return <ContactLayout searchQuery={searchQuery} />;
};

export default Contacts;
