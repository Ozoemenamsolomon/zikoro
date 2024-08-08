// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// type PostBlogRequestBody = {
//   title: string;
//   category: string;
//   tags: string[];
//   content: [];
//   headerImageUrl: string;
//   readingDuration: number;
//   status: string;
//   // statusDetail: { [key: string]: any }[];
// }

// export async function POST(req: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });
//   if (req.method === "POST") {
//     const body = (await req.json()) as PostBlogRequestBody | null;

//     if (!body) {
//       return NextResponse.json({ error: "Invalid request body" });
//     }

//     const {
//       title,
//       category,
//       tags,
//       content,
//       headerImageUrl,
//       readingDuration,
//       status,
//       // statusDetail,
//     } = body;

//     try {
//       const { data, error } = await supabase.from("blog").insert([
//         {
//           title: title,
//           category: category,
//           status: status,
//           readingDuration: readingDuration,
//           content: content,
//           tags: tags,
//           headerImageUrl: headerImageUrl,
//           views: 0,
//           shares: 0
//         },
//       ]);

//       if (error) {
//         throw error;
//       }
//       return NextResponse.json({ message: "Saved successfully." });
//     } catch (error) {
//       return NextResponse.json({ error: "Internal server error." });
//     }
//   }
// }


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
};

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
          readingDuration: readingDuration,
          content: content,
          tags: tags,
          headerImageUrl: headerImageUrl,
          views: 0,
          shares: 0,
        },
      ]);

      if (error) {
        throw error;
      }
      return NextResponse.json({ message: "Saved successfully." });
    } catch (error) {
      return NextResponse.json({ error: "Internal server error." });
    }
  } else if (req.method === "GET") {
    try {
      // Handling scheduled posts
      // Query scheduled posts that are due for publishing
      const { data: scheduledPosts, error } = await supabase
        .from("blog")
        .select("*")
        .lte("scheduledDateTime", new Date()) // Find posts scheduled on or before the current date/time
        .eq("status", "scheduled"); // Only select posts with status "scheduled"

      if (error) {
        throw error;
      }
      // Publish each scheduled post
      for (const post of scheduledPosts) {
        // Update post status to "published" in the database
        await supabase
          .from("blog")
          .update({ status: "published" })
          .eq("id", post.id);

        // Trigger additional actions for publishing the post
        // For example, send notifications, update indexes, etc.
        console.log("Published scheduled post:", post);
      }

      NextResponse.json({ message: "Scheduled posts published successfully" });
    } catch (error) {
      console.error("Error publishing scheduled posts:", error);
      NextResponse.json({ error: "Error publishing scheduled posts" });
    }
  } else {
    NextResponse.json({ error: "Method Not Allowed" });
  }
}
