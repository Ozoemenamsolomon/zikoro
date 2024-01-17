"use server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addContact(formData: FormData) {
  const organizationName = formData.get("organizationName");
  const country = formData.get("country");
  const eventPhoneNumber = formData.get("phoneNumber");
  const eventWhatsApp = formData.get("whatsappNumber");
  const eventContactEmail = formData.get("email");
  const x = formData.get("twitterUrl");
  const linkedIn = formData.get("linkedinUrl");
  const instagram = formData.get("instagramUrl");
  const facebook = formData.get("facebookUrl");
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.from("organization").insert([
    {
      organizationName,
      country,
      eventPhoneNumber,
      eventWhatsApp,
      eventContactEmail,
      x,
      linkedIn,
      instagram,
      facebook,
    },
  ]);
  if (error) {
    console.log(error);
  }
  revalidatePath("/getContact");
  console.log("contact added", data);

  return { message: "Success" };
}
