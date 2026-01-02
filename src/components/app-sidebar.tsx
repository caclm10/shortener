import { LayoutDashboardIcon, Link2Icon } from "lucide-react";
import * as React from "react";

import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarNavUser } from "@/components/sidebar-nav-user";
import { SidebarTitle } from "@/components/sidebar-title";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

const menuItems = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        name: "Links",
        url: "/links",
        icon: Link2Icon,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTitle />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav items={menuItems} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarNavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
