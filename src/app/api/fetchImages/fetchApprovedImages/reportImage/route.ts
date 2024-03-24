// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import {toast } from 'react-toastify';


// type UpdateLikesRequestBody = {
//   imgId: string;
//   comment: string;
// };

// export async function POST(req: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });

//   if (req.method === "POST") {
//     const body = await req.json() as UpdateLikesRequestBody | null;

//     if (!body) {
//       return NextResponse.json({error:"Invalid request body"});
//     }

//     const { imgId, comment } = body;

//     try {
//         const { error } = await supabase
//         .from('eventPhotos')
//         .update({"ReportsUsers": {
//           "description" : comment
//         }})
//         .eq('id', imgId);

//       if (error) {
//         throw error;
//       }

//       return NextResponse.json({message:"Report Sent successfully."});
//     } catch (error) {
//       return NextResponse.json({error: "Internal server error."});
//     }
//   }
// }


