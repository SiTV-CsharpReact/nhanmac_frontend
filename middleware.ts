import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    /* ================================
     * 1️⃣ AUTH GUARD /dashboard
     * ================================ */
    if (pathname.startsWith("/dashboard")) {
        const token = req.cookies.get("access_token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    /* ================================
     * 2️⃣ SEO CANONICAL NORMALIZER
     * ================================ */

    // Ignore system / static paths
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/upload") ||
        pathname === "/favicon.ico" ||
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml"
    ) {
       return response;
    }

    const parts = pathname.split("/").filter(Boolean);
    if (!parts.length)return response;

    const lastSegment = parts.at(-1);

    // Chỉ xử lý .html
    if (!lastSegment || !lastSegment.endsWith(".html")) {
       return response;
    }

    /**
     * Match:
     *   in-tem-kim-loai-sieu-mong-573.html
     *   hoặc path lồng:
     *   /abc/64-xxx/in-tem-kim-loai-sieu-mong-573.html
     */
    const match = lastSegment.match(/^([a-z0-9\-]+)-(\d+)\.html$/i);
    if (!match) {
       return response;
    }

    const [, alias, id] = match;
    const canonicalPath = `/${alias}-${id}.html`;

    // Nếu URL hiện tại KHÔNG canonical → redirect
    if (pathname !== canonicalPath) {
        return NextResponse.redirect(
            new URL(canonicalPath, req.url),
            301, // ✅ SEO preferred
        );
    }

   return response;
}

/* ================================
 * MATCHER
 * ================================ */
export const config = {
    matcher: ["/((?!_next|api|upload).*)"],
};
