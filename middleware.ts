import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const publicPaths = ['/', '/api/(.*)'];
const authPaths = ["/reset-password", "/signin(.*)", "/signup(.*)"];
const onBoardingPath = ["/onboarding"];

const isPublicRoute = createRouteMatcher([...publicPaths, ...authPaths]);
const isAuthRoute = createRouteMatcher([...authPaths, ...onBoardingPath]);
const isOnboardingRoute = createRouteMatcher(onBoardingPath);

export default clerkMiddleware(async (auth, request) => {
    const {userId, sessionClaims} = await auth();

    // Early return for sign-out request
    if (request.method === 'POST' && request.url.includes('/sign-out')) {
        return NextResponse.next();
    }

    // Handle sign-out redirects
    if (!userId && request.method === 'POST') {
        return NextResponse.next();
    }

    if (!userId && !isPublicRoute(request)) {
        await auth.protect();
    }

    if (userId &&
        (sessionClaims as any)?.metadata?.hasOnBoarded === undefined &&
        !isOnboardingRoute(request)) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    if (userId &&
        isAuthRoute(request) &&
        (sessionClaims as any)?.metadata?.hasOnBoarded) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};