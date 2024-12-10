"use client";

import * as React from "react";
import {
    Armchair,
    BookOpen,
    Frame,
    Handshake,
    Laptop2,
    LifeBuoy,
    Loader,
    Map,
    PieChart,
    Send,
    User,
} from "lucide-react";
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
import {SignedIn, SignedOut, SignInButton, useUser} from "@clerk/nextjs";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import useSWR from "swr";
import {NavUser} from "@/components/nav-user";

const data = {
    user: {
        name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg",
    }, navMain: [{
        title: "Dashboard", url: "/dashboard", icon: Armchair, isActive: true, visible: ["admin", "teacher", "student"],
    }, // {
        //     title: "Teachers",
        //     url: "/dashboard/teacher",
        //     icon: Armchair,
        //     isActive: true,
        // },
        {
            title: "Projects", url: "/projects", icon: Handshake, items: [{
                title: "Database Design", url: "#",
            }, {
                title: "Statistical Analysis", url: "#",
            }, {
                title: "Microprocessors", url: "#",
            },], visible: ["admin", "teacher", "student"],
        }, {
            title: "Courses", url: "/courses", icon: BookOpen, items: [{
                title: "Introduction", url: "#",
            }, {
                title: "Get Started", url: "#",
            }, {
                title: "Tutorials", url: "#",
            }, {
                title: "Changelog", url: "#",
            },], visible: ["admin", "teacher", "student"],
        }, {
            title: "Profile", url: "/profile", icon: User, items: [{
                title: "General", url: "/profile/general",
            }, {
                title: "Teams", url: "/profile/teams",
            }, {
                title: "Grades", url: "/profile/grades",
            },],
        },], navSecondary: [{
        title: "Support", url: "#", icon: LifeBuoy,
    }, {
        title: "Feedback", url: "#", icon: Send,
    },], chats: [{
        name: "Design Engineering", url: "#", icon: Frame,
    }, {
        name: "Sales & Marketing", url: "#", icon: PieChart,
    }, {
        name: "Travel", url: "#", icon: Map,
    },],
};
const fetcher = (...args) => fetch(...args).then(res => res.json())

export function SidebarLeft({...props}) {
    const {isLoaded, isSignedIn, user} = useUser();
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
            <NavMain items={data.navMain} />
            {isLoading ? <Loader className={"animate-spin"} /> : <NavChat groups={chatsData} />}
            <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            {isLoaded ? (<SignedIn>
                <NavUser
                    email={user?.emailAddresses[0]?.emailAddress}
                    avatar={user?.imageUrl}
                    name={user?.fullName}
                />
            </SignedIn>) : (<div className={"flex items-center space-x-4 h-[48px] w-full"}>
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className={"flex flex-col space-y-2 w-[10rem] items-center"}>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            </div>)}
        </SidebarFooter>
    </Sidebar>);
}
