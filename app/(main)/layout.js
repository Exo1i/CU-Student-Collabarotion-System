import {SidebarProvider} from "@/components/ui/sidebar";
import {SidebarLeft} from "@/components/sidebar-left";
import {SidebarRight} from "@/components/sidebar-right";

export default function RootLayout({children}) {


    return (<SidebarProvider>
        <SidebarLeft className="w-[var(--sidebar-width)]" />

        <main className="max-w-6xl mx-auto px-4 lg:px-8 w-full">
            {children}
        </main>

        <SidebarRight className="hidden md:block top-0 right-0 h-full w-[320px] bg-background z-50" />
    </SidebarProvider>);
}