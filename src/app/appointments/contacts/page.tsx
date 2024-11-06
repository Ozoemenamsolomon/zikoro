import ContactLayout from "@/components/appointments/contactPage";
import contacts from "@/components/appointments/contactPage/constants";
import ContactInfo from "@/components/appointments/contactPage/ContactInfo";
import ContactSubLayout from "@/components/appointments/contactPage/ContactSubLayout";
import { fetchContacts } from "@/lib/bookingsContact";
import React from "react";

const Contacts = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  console.log({data,count,error})
  return ( 
    <ContactLayout data={data} searchquery={s} >
      <ContactSubLayout>
        <ContactInfo />
      </ContactSubLayout>
    </ContactLayout>
    );
};

export default Contacts;
