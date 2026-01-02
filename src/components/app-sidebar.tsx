import { LayoutDashboardIcon, Link2Icon } from "lucide-react";
import * as React from "react";

import { NavUser } from "@/components/nav-user";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarTitle } from "@/components/sidebar-title";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },

    menu: {
        items: [
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
        ],
    },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTitle />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav items={data.menu.items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
