import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { startOfDay } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError.message);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    if (!user) {
      console.error("No user found in session");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const {
      data: userData,
      error: userError,
    } = await supabase.from('users').select('*').eq('userEmail', user.email).single();

    if (userError) {
      console.error("Error fetching user from database:", userError.message);
      return NextResponse.json({ error: "User fetch failed" }, { status: 401 });
    }

    if (!userData) {
      console.error("No user data found for email:", userData.userEmail);
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = userData.id;

    // Fetch appointment links created by the authenticated user
    const { data, error } = await supabase
      .from("appointmentLinks")
      .select("*")
      .eq("createdBy", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching appointment links:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unhandled error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

