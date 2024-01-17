import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
export default async function getContact() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: user } = await supabase.auth.getUser();

  const { data: contact, error } = await supabase.from("organization").select();
  if (error) {
    console.error("Error fetching contact");
  } else {
    console.log(
      contact.map(
        (contact: { organisationName: string }) => contact.organisationName
      )
    );
  }
  return <pre>{JSON.stringify(contact, null, 2)}</pre>;
}
