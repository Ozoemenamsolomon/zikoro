import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Define the paths that should be protected
const includedPaths = [
  "/affiliates",
  "/billing",
  "/events",
  "/home",
  "/profile",
  "/referrals",
  "/appointments",
  "/create",
  "/admin",
  "/event/:eventId/reception"

];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  console.log('middleware path',path)
  
  // pathname include reception
  // searchparam not include email and isPasswordless
  // searchParam include eventId
  // no session

  if (path.includes("reception")) {
    console.log("from middleware")
    const searchParams = req.nextUrl.searchParams
    const email = searchParams.get("email")
    const isPasswordless = searchParams.get("isPasswordless")
   if (!email || !isPasswordless) {
   
   if (!session) {
    
      const pathLength = path.split("/").length
      const eventId = path.split("/")[pathLength -2]
      const redirectUrl = new URL(`/request/access/${eventId}`, req.url);

      return NextResponse.redirect(redirectUrl);
    }
   }
  }


  // Check if the request path starts with /appointments
  if (path.startsWith("/appointments")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = new URL("/bookings", req.url);
      // redirectUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // // Check if the request path is included in the protected paths
  // const isIncludedPath = includedPaths.some((includedPath) =>
  //   path.startsWith(includedPath)
  // );
  
  // if (isIncludedPath && !session) {
  //   // If user is not authenticated and path is included, redirect to the login page
  //   if (path.startsWith("/api")) {
  //     return NextResponse.json(
  //       { error: "Authorization failed" },
  //       { status: 403 }
  //     );
  //   } else {
  //     const redirectUrl = new URL("/login", req.url);
  //     redirectUrl.searchParams.set("redirectedFrom", path);
  //     return NextResponse.redirect(redirectUrl);
  //   }
  // }

  // Allow the request to proceed if the user is authenticated or the path is not included
  return res;
}

export const config = {
  matcher: [
    "/affiliates/:path*",
    "/billing/:path*",
    "/events/:path*",
    "/home/:path*",
    "/profile/:path*",
    "/referrals/:path*",
    "/appointments/:path*",
    "/admin/:path*",
    "/event/:path*"
  ],
};
