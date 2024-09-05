import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
    const supabase = createRouteHandlerClient({ cookies });

    const { eventId} = params;

    if (req.method === "GET") {
        try {
            const { data, error } = await supabase.from("discount").select("*").eq("eventId", eventId);

            const discounts = data?.filter((v) => v?.discountUsers === "attendees" || v?.discountUsers === "both")

            if (error) {
                return NextResponse.json({
                    data: error?.message
                },
                    {
                        status: 400
                    })
            }
            if (error) throw error;
            return NextResponse.json(
                {
                    data: discounts,
                },
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
