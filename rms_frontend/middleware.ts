import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token");
    const isAuthPage = request.nextUrl.pathname.startsWith("/login");
    const isPublicPath = request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.includes("."); // This will match static files like .css, .js, etc.

    // Allow public paths
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Handle auth pages
    if (isAuthPage) {
        if (token) {
            // If user has token, redirect to dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Protect ALL other routes - require authentication
    if (!token) {
        // Redirect to login if no token
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
    }

    return NextResponse.next();
}

// This matcher will catch all routes except static files and API routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
}; 