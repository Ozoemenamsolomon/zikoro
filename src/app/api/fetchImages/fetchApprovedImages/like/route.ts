import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });

    if (req.method === "PATCH") {
        // try {        
        //     // Update the parameters for the specified image
        //     const { error } = await supabase
        //       .from('eventPhotos')
        //       .update({"likes": like +1})
        //       .eq('id', imageId);

        //     if (error) {
        //       throw error;
        //     }

        //   } catch (error) {

        // }

    }
}