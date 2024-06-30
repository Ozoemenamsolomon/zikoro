import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Define the paths that should be protected
const includedPaths = [
  "/affiliates",
  "/billing",
  "/event",
  "/events",
  "/home",
  "/profile",
  "/referrals",
  "/appointments",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();


 /**
  // Check if the request path is included
  const isIncludedPath = includedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

   if (isIncludedPath && !session) {
    // If user is not authenticated and path is included, redirect to the login page
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Authorization failed" },
        { status: 403 }
      );
    } else {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }


  // Allow the request to proceed if user is authenticated or the path is not included
  return res;
 
 
  */

}

export const config = {
  matcher: [
    "/affiliates/:path*",
    "/billing/:path*",
    "/event/:path*",
    "/events/:path*",
    "/home/:path*",
    "/profile/:path*",
    "/referrals/:path*",
  ],
};
