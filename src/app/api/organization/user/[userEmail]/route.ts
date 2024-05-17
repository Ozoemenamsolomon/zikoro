import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { organizationId: number } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const { organizationId } = params;
      ``;
      const payload = await req.json();

      const { error } = await supabase
        .from("organization")
        .update(payload)
        .eq("id", organizationId);

      if (error) throw error;
      return NextResponse.json(
        { msg: "organization updated successfully" },
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
          status: 400,
        }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Method not allowed" },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const { error } = await supabase
        .from("organization")
        .upsert(params, { onConflict: "id" });
      if (error) throw error;
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

export async function GET(
  req: NextRequest,
  { params }: { params: { userEmail: number } }
) {
  const { userEmail } = params;
  const supabase = createRouteHandlerClient({ cookies });
  console.log(userEmail);

  if (req.method === "GET") {
    try {
      const {
        data: organizations,
        error,
        status,
      } = await supabase.from("organization").select("*");

      const filteredOrganizations = organizations?.filter((organization) => {
        return organization.teamMembers?.some(
          ({ userEmail: email }) => email === userEmail
        );
      });

      console.log(organizations);
      console.log(filteredOrganizations);

      if (error) throw error;

      return NextResponse.json(
        {
          data: filteredOrganizations,
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

export const dynamic = "force-dynamic";
