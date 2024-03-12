import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });

    if (req.method === "PATCH") {
        try {
            const params = await req.json();
        }
        catch {
            
        }
    }

}