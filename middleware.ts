import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs'
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest){
    const path = req.nextUrl.pathname;
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req, res});
    await supabase.auth.getSession();

    const unprotectedPaths = ['/login', '/register'];

    const isPublicPath = unprotectedPaths.includes(path);
 
   const user = req.cookies.get('user')?.value || '';
  
   
    if (!isPublicPath && !user  && path !== '/login') {
        const loginUrl = new URL('/login', req.nextUrl.origin).toString();
     return NextResponse.redirect(loginUrl);
   }
   
 //   return res;
}
