"use server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addDiscount(formData: FormData) {
  const discountCode = formData.get("discountCode");
  const minQty = formData.get("minQty");
  const discountAmount = parseInt(formData.get("discountAmount") as string);
  const discountPercentage = formData.get("percentage");
  const validUntil = formData.get("validUntil");
  const quantity = formData.get("quantity");
  const status = true;

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.from("discount").insert([
    {
      discountCode,
      eventId: Math.random().toString(16).slice(2),
      minQty,
      quantity,
      discountAmount,
      discountPercentage,
      validUntil,
      status,
    },
  ]);
  if (error) {
    console.log(error);
  }
  revalidatePath("/getDiscount");
  console.log("discount added", data);

  return { message: "Success" };
}
