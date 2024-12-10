"use client"

import {Book, MoreHorizontal, Plus,} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link";
import useChatStore from "@/hooks/useChatStore";


export function NavChat({groups}) {
    const {isMobile} = useSidebar()
    const {selectedGroupID, setSelectedGroupID} = useChatStore();


    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarMenu>
                {groups?.map((group) => (
                    <SidebarMenuItem key={group.group_id}>
                        <SidebarMenuButton asChild>
                            <Link href={'/chat'} onClick={() => setSelectedGroupID(group.group_id)}
                            >
                                {/*<item.icon />*/}
                                <span>{group.group_name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Book className="text-muted-foreground" />
                                    <span>View Project Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Plus className="text-muted-foreground" />
                                    <span>Join a team</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
