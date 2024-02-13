import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export default async function getEvent() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: certificate, error } = await supabase
    .from("certificate")
    .select();
  if (error) {
    console.error("Error fetching certificate");
    //   } else {
    //     const lastItem = events[events.length - 1];
    //     // console.log(lastItem?.id);
  }
  return <pre>{JSON.stringify(certificate, null, 2)}</pre>;
}
