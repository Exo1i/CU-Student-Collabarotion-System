import localFont from "next/font/local";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {AlertProvider} from "@/components/alert-context";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900",
});

export const metadata = {
    title: "CU - Student Collab System", description: "A Student Collaboration System",
};

export default function RootLayout({children}) {
    return (<html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <AlertProvider>
                <ClerkProvider afterSignOutUrl={'/'} signInForceRedirectUrl={'/dashboard'}
                               signUpForceRedirectUrl={'/onboarding'}>
                    {children}
                </ClerkProvider>
            </AlertProvider>
        </body>
    </html>);
}
