import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
export default async function getDiscount() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: user } = await supabase.auth.getUser();

  const { data: discount, error } = await supabase.from("discount").select();
  if (error) {
    console.error("Error fetching discount");
  } else {
    console.log(discount.map((discount) => discount.discountCode));
  }
  //   revalidatePath("/api/event");
  return <pre>{JSON.stringify(discount, null, 2)}</pre>;
}
