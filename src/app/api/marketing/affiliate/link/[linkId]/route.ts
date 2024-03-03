import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: { linkId: string } }) {
    const supabase = createRouteHandlerClient({ cookies });
    if (req.method === "GET") {
        try {
            const { linkId } = params;
            const { data, error, status } = await supabase
                .from("affiliateLinks")
                .select("*, eventTransactions!inner(*)").eq("id", linkId).maybeSingle();

            if (error) throw error;

            return NextResponse.json(
                { data },
                {
                    status: 200,
                }
            );
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {
                    error: "An error occurred while making the request.",
                },
                {
                    status: 500,
                }
            );
        }
    } else {
        return NextResponse.json({ error: "Method not allowed" });
    }
}

export const dynamic = "force-dynamic";
