import localFont from "next/font/local";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {AlertProvider} from "@/components/alert-context";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900",
});

export const metadata = {
    title: "CU - Student Collaboration System",
    description: "Made using Next.js, Vercel, Clerk, Railway, and Tailwind CSS,",
};

export default function RootLayout({children}) {
    // Add console logging to verify environment variables
    console.log('Sign-out URL:', process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL);

    return (<ClerkProvider
        afterSignOutUrl="/"
        signInUrl="/signin"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/onboarding"
        appearance={{
            baseTheme: undefined,
            signIn: {baseTheme: undefined},
            signUp: {baseTheme: undefined},
            userButton: {baseTheme: undefined}
        }}
    >
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AlertProvider>
                    {children}
                    <Analytics />
                    <SpeedInsights />
                </AlertProvider>
            </body>
        </html>
    </ClerkProvider>);
}