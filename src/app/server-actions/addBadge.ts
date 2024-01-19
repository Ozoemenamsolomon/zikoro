import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addBadge(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase.from("events").insert([
    {
      badgeColor: formData.get("badgeColor"),
      badgeHeader: formData.get("badgeHeader"),
      badgeName: formData.get("fullname" || "lastname" || "firstname"),
      badgeAvatar: formData.get("noAvatar" || "orgLogo" || "profilePic"),
      badgeJobTitle: formData.get("showJobTitle" || "hideJobTitle"),
      badgeOrganisationName: formData.get("showOrgName" || "hideOrgName"),
      badgeAttendeeType: formData.get("showAttendeeType" || "hideAttendeeType"),
    },
  ]);
  if (error) {
    console.log(error);
  }
  //   revalidatePath("/getDiscount");
  console.log("badge added", data);

  return { message: "Success" };
}
