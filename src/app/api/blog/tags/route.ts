import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Tag {
  tags: string[];
}

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  //   if (req.method === "GET") {
  //     const body = (await req.json()) as Tag;

  //     if (!body) {
  //       return NextResponse.json({ error: "Invalid request body" });
  //     }
  //     const { tags } = body;

  //     try {
  //       const { data, error } = await supabase
  //         .from("blog")
  //         .select("*")
  //         .in("tag", tags?.toString().split(",")); // Split the tags string into an array

  //       if (error) {
  //         throw error;
  //       } else {
  //         return NextResponse.json({ message: "Successful." });
  //       }
  //     } catch (error) {
  //       return NextResponse.json({ error: "Internal server error." });
  //     }
  //   } else {
  //     return NextResponse.json({ error: "Internal server error." });
  //   }

  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tags");
    const tags: string[] = tag ? tag.split(",") : [];
    try {
      const filteredTags: string[] = tags.filter(
        (tag: any) => typeof tag === "string"
      ); // Filter out non-string values
      if (filteredTags.length === 0) {
        throw new Error("Tags parameter is missing or invalid");
      }

      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .in("tag", filteredTags); // Use filteredTags

      if (error) {
        throw error;
      } else {
        return NextResponse.json({ message: "Successful." });
      }
    } catch (error) {
      return NextResponse.json({ error: "Internal server error." });
    }
  } else {
    return NextResponse.json({ error: "Internal server error." });
  }
}
