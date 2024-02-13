"use server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addContact(formData: FormData) {
  const organisationName = formData.get("organizationName");
  const country = formData.get("country");
  const phoneNumber = formData.get("phoneNumber");
  const whatsappNumber = formData.get("whatsappNumber");
  const email = formData.get("email");
  const x = formData.get("twitterUrl");
  const linkedin = formData.get("linkedinUrl");
  const instagram = formData.get("instagramUrl");
  const facebook = formData.get("facebookUrl");

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: events, error: fetchEventError } = await supabase
    .from("events")
    .select();
  if (fetchEventError) {
    console.error("Error fetching id");
  }
  // you should have a userId or sessionId that will get the events perculiar to you

  const organisationID = events?.[events.length - 1].organisationId;
  const { data, error: upsertEventError } = await supabase
    .from("events")
    .update([
      {
        organisationName,
        country,
        phoneNumber,
        whatsappNumber,
        email,
        x,
        linkedin,
        instagram,
        facebook,
      },
    ])
    .eq("organisationId", organisationID);
  if (upsertEventError) {
    console.log("Error uploading contact", upsertEventError);
  }
  revalidatePath("/getContact");
  console.log("contact added", organisationID);

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
      {JSON.stringify(upsertEventError, null, 2)}
    </pre>
  );
}

// export async function getLastSavedId() {
//   const cookieStore = cookies();
//   const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
//   const { data: events, error } = await supabase.from("events").select();
//   if (error) {
//     console.error("Error fetching id");
//   }

//   const organisationID = events?.map((e) => e.id).sort((a, b) => b - a)[0];
//   // console.log("lastId", lastItemID);
//   const { data: lastItem, error: error2 } = await supabase
//     .from("events")
//     .update({ published: true })
//     .eq("organisationId", organisationID);
//   if (error2) {
//     console.error("Error updating pushed status", error2);
//   } else {
//     console.log("updated", lastItem);
//   }
//   return lastItem;
// }
