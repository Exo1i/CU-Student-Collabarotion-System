"use client";

import * as React from "react";
import {Armchair, BookOpen, Handshake, Laptop2, LifeBuoy, Loader, Send, User} from "lucide-react";
import {NavMain} from "@/components/nav-main";
import {NavChat} from "@/components/NavChat";
import {NavSecondary} from "@/components/nav-secondary";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {SignedOut, SignInButton, useUser} from "@clerk/nextjs";
import Link from "next/link";
import useSWR from "swr";
import {NavUser} from "@/components/nav-user";

const data = {
    navMain: [{
        title: "Dashboard", url: "/dashboard", icon: Armchair, isActive: true,
    }, {
        title: "Projects", url: "/projects", icon: Handshake, items: [],
    }, {
        title: "Courses", url: "/courses", icon: BookOpen, items: [],
    }], navSecondary: [{
        title: "Support", url: "#", icon: LifeBuoy,
    }, {
        title: "Feedback", url: "#", icon: Send,
    },]
};
const fetcher = (...args) => fetch(...args).then(res => res.json())

export function SidebarLeft({...props}) {
    const {isLoaded, isSignedIn, user,} = useUser();
    const {data: chatsData, isLoading, error} = useSWR('/api/chat', fetcher)

    return (<Sidebar variant="inset" {...props}>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <Link href="#">
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Laptop2 className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Cairo University
                  </span>
                                <span className="truncate text-xs">Computer Engineering</span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <NavMain items={[...data.navMain, {title: "Profile", url: `/profile/`, icon: User, items: [],}]} />
            {isLoading ? <Loader className={"animate-spin"} /> : <NavChat groups={chatsData} />}
            <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <NavUser />
        </SidebarFooter>
    </Sidebar>);
}
