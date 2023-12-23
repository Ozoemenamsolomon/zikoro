import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  if (req.method === "POST") {
    try {
      return NextResponse.json({
        data: { msg: "hello world" },
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        error: "An error occurred while making the request.",
        status: 500,
      });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export const dynamic = "force-dynamic";
