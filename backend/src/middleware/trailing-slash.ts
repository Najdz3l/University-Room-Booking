import type { Context, Next } from "hono";

export const trailingSlashMiddleware = async (c: Context, next: Next) => {
  const url = new URL(c.req.url);
  if (url.pathname.endsWith("/") && url.pathname.length > 1) {
    url.pathname = url.pathname.slice(0, -1);
    return c.redirect(url.pathname + url.search, 301);
  }
  return next();
};
