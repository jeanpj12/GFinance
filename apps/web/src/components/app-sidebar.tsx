"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Wallet,
  ChartBarBig,
  ClipboardPlus,
  Tag,
  Calendar,
  ShipWheel,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavAnalisys } from "./nav-analisys";
import { Separator } from "./ui/separator";
import { MyCalendar } from "./calendar";
import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "Jean Jr",
    email: "jeanpj12@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: Wallet,
      isActive: true,
      items: [],
    },
  ],
  analysis: [
    {
      title: "Charts",
      url: "/charts",
      icon: ChartBarBig,
      isActive: true,
      items: [],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: ClipboardPlus,
      isActive: true,
      items: [],
    },
    {
      title: "Simulator",
      url: "/simulator",
      icon: ShipWheel,
      isActive: true,
      items: [],
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Tag,
      isActive: true,
      items: [],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      isActive: true,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
        <SidebarRail />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <Separator />
        <NavMain items={data.navMain} />
        <Separator />
        <NavAnalisys items={data.analysis} />
      </SidebarContent>
    </Sidebar>
  );
}
