import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs'
import {NextRequest, NextResponse} from 'next/server'

export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req, res});
    await supabase.auth.getSession();
    return res;
}

// import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

//export default withMiddlewareAuthRequired();

/* export const config = {
  //TODO: Determine route matcher
  matcher: "/about/:path*",
}; */

