import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const authRoutes = ["/reset-password", "/signin(.*)", "/signup(.*)"];
const isAuthRoute = createRouteMatcher(authRoutes);
const isPublicRoute = createRouteMatcher(['/', ...authRoutes])

const isDevelopment = process.env.NODE_ENV === "development";

export default clerkMiddleware(async (auth, request) => {
    const {userId} = await auth();
    if (userId && isAuthRoute(request))
        return NextResponse.redirect(new URL('/dashboard', request.url))

    if (!isPublicRoute(request) && !userId && !isDevelopment) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
        "/dashboard/(.*)",
    ],
};
