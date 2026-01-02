import { type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

function SidebarNav({
    items,
}: {
    items: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {
    const location = useLocation();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link
                                to={item.url}
                                aria-current={
                                    location.pathname.startsWith(item.url)
                                        ? "page"
                                        : undefined
                                }
                                data-active={
                                    location.pathname.startsWith(item.url) ||
                                    undefined
                                }
                                className="data-active:bg-accent"
                            >
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export { SidebarNav };
