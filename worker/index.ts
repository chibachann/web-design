/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { resolveSiteSlug, sitePathname } from "../lib/host-routing";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ROOT_DOMAIN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  /** Routes recognized style subdomains to their internal path fallback. */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const host = request.headers.get("x-forwarded-host") ?? url.host;
    const siteSlug = resolveSiteSlug(host, env.ROOT_DOMAIN ?? "localhost");
    const isStaticAsset =
      url.pathname.startsWith("/_") || /\.[a-z0-9]+$/i.test(url.pathname);

    if (siteSlug && !isStaticAsset) {
      url.pathname = sitePathname(siteSlug, url.pathname);
      return handler.fetch(new Request(url, request), env, ctx);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
