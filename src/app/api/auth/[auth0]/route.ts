import { getUser as getUser } from "@/actions/users";
import {
  AfterCallbackAppRoute,
  AppRouteHandlerFnContext,
  getSession,
  handleAuth,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

const afterCallback: AfterCallbackAppRoute = (req, session) => {

  if (!session.user.isFirstLogin) {
    const user = getUser(session.user.email);
    session.user.zikoroUser = user;
  }

  return session;
};

export const GET = handleAuth({
  async callback(req: NextRequest, ctx: AppRouteHandlerFnContext) {

    const res = await handleCallback(req, ctx, { afterCallback });
    const session = await getSession();
    if (session?.user.isFirstLogin) {
      return NextResponse.redirect(
        `${process.env.AUTH0_BASE_URL}/onboarding`,
        res
      );
    }
    return res;
  },

});

