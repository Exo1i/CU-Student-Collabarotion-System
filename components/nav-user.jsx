"use client";
import {SidebarMenu, SidebarMenuItem} from "@/components/ui/sidebar";
import {UserButton, useUser} from "@clerk/nextjs";
import {useRef} from 'react';

export function NavUser() {
    const {user, isLoaded} = useUser();
    const buttonRef = useRef();

    const handleClick = () => {
        const button = buttonRef.current?.querySelector('button');
        if (button) {
            button.click();
        }
    };

    if (!isLoaded) return null;

    return (<SidebarMenu>
        <SidebarMenuItem
            className="flex flex-row cursor-pointer hover:bg-sidebar-accent/10 transition-colors"
            onClick={handleClick}
        >
            <div className="w-full flex items-center p-2">
                <div ref={buttonRef}>
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "h-[3em] w-[3em] rounded-full",
                            },
                        }}
                        afterSignOutUrl="/"
                    />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-semibold">
                            {user.firstName} {user.lastName}
                        </span>
                    <span className="truncate text-xs">
                            {user.emailAddresses[0]?.emailAddress}
                        </span>
                </div>
            </div>
        </SidebarMenuItem>
    </SidebarMenu>);
}