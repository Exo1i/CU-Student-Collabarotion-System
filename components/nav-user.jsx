"use client";
import {SidebarMenu, SidebarMenuItem} from "@/components/ui/sidebar";
import {ClerkLoaded, ClerkLoading, UserButton, useUser} from "@clerk/nextjs";
import * as React from 'react';
import {useRef} from 'react';
import {Skeleton} from "@/components/ui/skeleton";

export function NavUser() {
    const {user, isLoaded} = useUser();
    const buttonRef = useRef();

    return (
        <SidebarMenu>
            <SidebarMenuItem
                className="flex flex-row cursor-pointer hover:bg-sidebar-accent/10 transition-colors"
            >
                <ClerkLoading>
                    <div className={"flex items-center space-x-4 h-[48px] w-full"}>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className={"flex flex-col space-y-2 w-[10rem] items-center"}>
                            <Skeleton className="h-2 w-full rounded-full" />
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    </div>
                </ClerkLoading>
                <ClerkLoaded>
                    {<div className="w-full flex items-center p-2">
                        <div ref={buttonRef}>
                            <UserButton
                                afterSignOutUrl="/"  // Add this to ensure redirect after sign-out
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-[3em] w-[3em] rounded-full",
                                    },
                                }}
                            />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                            <span className="truncate font-semibold">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="truncate text-xs">
                                {user?.emailAddresses[0]?.emailAddress}
                            </span>
                        </div>
                    </div>}
                </ClerkLoaded>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}