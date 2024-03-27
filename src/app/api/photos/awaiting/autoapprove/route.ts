// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";


// export async function POST(req: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });

//   if (req.method === "POST") {
//     try {
//       const { error } = await supabase
//           .from('eventPhotos')
//           .update({"photoStatus": 'approved'})
//           .eq('photoStatus', 'awaiting');

//       if (error) {
//         throw error;
//       }

//       return NextResponse.json({ message: "Re-approved successfully." });
//     } catch (error) {
//       return NextResponse.json({ error: "Internal server error." });
//     }
//   }
// }
