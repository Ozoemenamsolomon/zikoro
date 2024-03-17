import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface UpdateLikesRequestBody {
  imageId: string;
  like: number;
};


export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method === "POST") {

    const body =  await req.json() as UpdateLikesRequestBody | null;

    if (!body) {
      return NextResponse.json({error:"Invalid request body"});
    }

    const { imageId, like} = body;

    try {
      const { error } = await supabase
        .from("eventPhotos")
        .update({ likes: like + 1 })
        .eq("id", imageId);

      if (error) {
        throw error;
      }
      return NextResponse.json({message:"Like updated successfully."});
    } catch (error) {
      return NextResponse.json({error: "Internal server error."});
    }
  }
}



