import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/signin(.*)", "/signup(.*)"]);

const isDevelopment = process.env.NODE_ENV === "development";

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request) && !isDevelopment) {
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
