import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

interface SessionMetadata {
    metadata?: {
        hasOnBoarded?: boolean;
    };
}

const onBoardingRoute = ["/onboarding"];
const authRoutes = ["/reset-password", "/signin(.*)", "/signup(.*)"];
const isAuthRoute = createRouteMatcher([...authRoutes, ...onBoardingRoute]);
const isOnboardingRoute = createRouteMatcher(onBoardingRoute);
const isPublicRoute = createRouteMatcher(['/', '/api/(.*)', ...authRoutes]);
const isDevelopment = process.env.NODE_ENV === "development";


export default clerkMiddleware(async (auth, request) => {
        const {userId, sessionClaims} = await auth();

        // 1. First check - protect non-public routes
        if (!userId && !isPublicRoute(request)) {
            await auth.protect();
        }

        // 2. If user is authenticated but hasn't onboarded
        if (userId &&
            (sessionClaims as SessionMetadata)?.metadata?.hasOnBoarded === undefined &&
            !isOnboardingRoute(request)) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        // 3. If user is authenticated and tries to access auth routes
        if (userId &&
            isAuthRoute(request) &&
            (sessionClaims as SessionMetadata)?.metadata?.hasOnBoarded) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-url', request.url);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    }
)
;

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/dashboard/(.*)",
    ],
};