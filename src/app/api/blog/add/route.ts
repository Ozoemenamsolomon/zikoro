import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type PostBlogRequestBody = {
  title: string;
  category: string;
  tags: string[];
  content: [];
  headerImageUrl: string;
  readingDuration: number;
  status: string;
  // statusDetail: { [key: string]: any }[];
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    const body = (await req.json()) as PostBlogRequestBody | null;
    
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    const {
      title,
      category,
      tags,
      content,
      headerImageUrl,
      readingDuration,
      status,
      // statusDetail,
    } = body;

    try {
      const { data, error } = await supabase.from("blog").insert([
        {
          title: title,
          category: category,
          status: status,
          // statusDetails: statusDetail,
          readingDuration: readingDuration,
          content: content,
          tags: tags,
          headerImageUrl: headerImageUrl,
          views: 0,
          shares: 0
        },
      ]);

      if (error) {
        throw error;
      }
      return NextResponse.json({ message: "Saved successfully." });
    } catch (error) {
      return NextResponse.json({ error: "Internal server error." });
    }
  }
}
