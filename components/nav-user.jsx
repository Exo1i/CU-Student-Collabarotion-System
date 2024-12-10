"use client";
import {SidebarMenu, SidebarMenuItem} from "@/components/ui/sidebar";
import {UserButton, useUser} from "@clerk/nextjs";
import {useEffect, useRef} from 'react';
import {updateUser} from "@/actions/user-actions";

export function NavUser() {
    const {user, isLoaded} = useUser();
    const buttonRef = useRef();

    const handleClick = () => {
        const button = buttonRef.current?.querySelector('button');
        if (button) {
            button.click();
        }
    };

    // Sync user profile changes to database
    useEffect(() => {
        if (!isLoaded || !user) return;

        // Fire and forget - send request without waiting for response
        const syncUserProfile = () => {
            // Intentionally not awaiting the result
            updateUser({
                user_id: user.id,
                username: user.username || undefined,
                fname: user.firstName || '',
                lname: user.lastName || '',
                img_url: user.imageUrl || undefined
            });
        };

        // Debounce to prevent multiple rapid updates
        const timeoutId = setTimeout(syncUserProfile, 500);

        return () => clearTimeout(timeoutId);
    }, [user, isLoaded]);

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