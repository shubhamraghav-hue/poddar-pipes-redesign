import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Next 16 renamed the `middleware` file convention to `proxy` (see
// https://nextjs.org/docs/messages/middleware-to-proxy). next-intl's handler is
// exported here as the default proxy function; behaviour is unchanged.
export default createMiddleware(routing);

export const config = {
  // Match all paths except static files, API routes (none here), and Next internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
