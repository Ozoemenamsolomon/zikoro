// import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { error } = await supabase.from("training").insert(params);
      if (error) {
        throw error;
      }
      return NextResponse.json(
        { msg: "event created successfully" },
        {
          status: 201,
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

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const { error } = await supabase
        .from("training")
        .upsert(params, { onConflict: "id" });
      if (error) {
        throw error;
      }
      return NextResponse.json(
        { msg: "event updated successfully" },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error, "patch");
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("training")
        .select("*");

      if (error) {
        throw error;
      }

      return NextResponse.json(
        {
          data,
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

// export async function DELETE(req: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });
//   if (req.method === "DELETE") {
//     try {
//       const params = await req.json();

//     }
//     catch (error) {
//       console.error(error);
//       return NextResponse.json(
//         {
//           error: "An error occurred while making the request.",
//         },
//         {
//           status: 500,
//         }
//       );
//     }}

// }

// export const dynamic = "force-dynamic";
