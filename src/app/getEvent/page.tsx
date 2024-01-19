import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export default async function getEvent() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: events, error } = await supabase.from("events").select();
  if (error) {
    console.error("Error fetching events");
  } else {
    const lastItem = events[events.length - 1];
    // console.log(lastItem?.id);
  }
  return <pre>{JSON.stringify(events, null, 2)}</pre>;
}

// export async function revalidate() {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       "Cache-Control": "public, max-age=60, s-maxage=60",
//     },
//   });
// }

// export async function getLastSavedId() {
//   const cookieStore = cookies();
//   const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
//   const { data: events, error } = await supabase.from("events").select();
//   if (error) {
//     console.error("Error fetching id");
//   }

//   const lastItemID = events?.map((e) => e.id).sort((a, b) => b - a)[0];
//   // console.log("lastId", lastItemID);
//   const { data: lastItem, error: error2 } = await supabase
//     .from("events")
//     .update({ published: true })
//     .eq("id", lastItemID);
//   if (error2) {
//     console.error("Error updating pushed status", error2);
//   } else {
//     // console.log("updated", lastItem);
//   }
//   return lastItem;
// }
