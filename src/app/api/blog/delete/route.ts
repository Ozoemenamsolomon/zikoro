import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type DeleteBlogRequestBody = {
  id: number;
};

export async function DELETE(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "DELETE") {
    const body = (await req.json()) as DeleteBlogRequestBody | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }
    const { id } = body;

    try {
      const { data, error } = await supabase.from("blog").delete().eq("id", id);

      if (error) {
        throw error;
      }
      return NextResponse.json({ message: "Deleted successfully." });
    } catch (error) {
      return NextResponse.json({ error: "Internal server error." });
    }
  }
}
