"use client"

import {ChevronRight} from "lucide-react"
import {usePathname} from 'next/navigation';
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function NavMain({
                            items,
                        }) {
    const pathname = usePathname();
    // console.log(pathname)
    return (<SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
            {items.map((item) => {
                const isActive = pathname.slice('/').includes(item.url.split('/')[1]);
                return <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={item.title}
                                           isActive={isActive}>
                            <Link href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        {item.items?.length ? (<>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuAction className="data-[state=open]:rotate-90">
                                    <ChevronRight color={isActive ? "white" : "black"} />
                                    <span className="sr-only">Toggle</span>
                                </SidebarMenuAction>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (<SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton asChild
                                                              isActive={subItem.url === pathname}>
                                            <Link href={subItem.url}>
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </>) : null}
                    </SidebarMenuItem>
                </Collapsible>
            })}
        </SidebarMenu>
    </SidebarGroup>)
}
