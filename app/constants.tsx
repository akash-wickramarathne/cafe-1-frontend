import { Icon } from "@iconify/react";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/admin/dashboard",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Waiters",
    path: "/admin/waiters",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Tables",
    path: "/admin/tables",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Projects",
    path: "/admin/projects",
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "All", path: "/admin/projects" },
      { title: "Web Design", path: "/admin/projects/web-design" },
      { title: "Graphic Design", path: "/admin/projects/graphic-design" },
    ],
  },
  {
    title: "Messages",
    path: "/admin/messages",
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },
  // {
  //   title: "Settings",
  //   path: "/admin/settings",
  //   icon: <Icon icon="lucide:settings" width="24" height="24" />,
  //   submenu: true,
  //   subMenuItems: [
  //     { title: "Account", path: "/admin/settings/account" },
  //     { title: "Privacy", path: "/admin/settings/privacy" },
  //   ],
  // },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
  },
  {
    title: "Help",
    path: "/admin/help",
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];
