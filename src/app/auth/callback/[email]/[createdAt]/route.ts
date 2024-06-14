import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string; createdAt: string } }
) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error_description");
  const { email, createdAt } = params;

  // console.log('error ', error);

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      if (exchangeError) {
        alert("Session has Expired.")
      }
      throw exchangeError
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/onboarding?email=${email}&createdAt=${createdAt}`);
}
