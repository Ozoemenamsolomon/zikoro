import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();


 export const config = {
  //TODO: Determine route matcher
  matcher: ["/:path*",]
}; 
