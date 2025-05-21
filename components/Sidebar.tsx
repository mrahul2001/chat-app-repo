"use client";

import { AnalyticsIcon, BroadcastIcon, CollapseIcon, PeriskopeIcon, RulesIcon } from "@/utils/Icons";
import { IconType } from "react-icons";
import { IoChatbubbleEllipses, IoTicket } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";
import { MdChecklist } from "react-icons/md";
import { BsGearFill } from "react-icons/bs";
import { TbStarsFilled } from "react-icons/tb";
import { AiFillHome } from "react-icons/ai";
import SidebarNavLink from "./SidebarNavLink";
import { usePathname } from "next/navigation";

interface NavItem {
  path?: string;
  icon?: IconType;
  hasDivider?: boolean;
  isNewFeature?: boolean;
  isAvailable?: boolean;
}

const Sidebar: React.FC = () => {
  const currentPath = usePathname();
  if (currentPath.includes("/auth")) return null;

  const navItems: NavItem[] = [
    { path: "/dashboard", icon: AiFillHome, isAvailable: false },
    { hasDivider: true },
    { path: "/chats", icon: IoChatbubbleEllipses, isAvailable: true },
    { path: "/tickets", icon: IoTicket, isAvailable: false },
    { path: "/analytics", icon: AnalyticsIcon, isAvailable: false },
    { hasDivider: true },
    { path: "/list", icon: FaListUl, isAvailable: false },
    { path: "/broadcast", icon: BroadcastIcon, isAvailable: false },
    { path: "/rules", icon: RulesIcon, isNewFeature: true, isAvailable: false },
    { hasDivider: true },
    { path: "/contacts", icon: RiContactsBookFill, isAvailable: false },
    { path: "/media", icon: RiFolderImageFill, isAvailable: false },
    { hasDivider: true },
    { path: "/logs", icon: MdChecklist, isAvailable: false },
    { path: "/settings", icon: BsGearFill, isAvailable: false },
  ];

  return (
    <nav className="h-screen w-16 flex flex-col justify-between border-r border-gray-300 p-1">
      <div className="flex flex-col gap-1 p-1">
        <div className="flex justify-center p-3">
          <PeriskopeIcon className="h-11 w-11" />
        </div>
        {navItems.map((item, idx) =>
          item.hasDivider ? (
            <div key={`divider-${idx}`} className="border-t border-gray-300 my-2" />
          ) : (
            item.path &&
            item.icon && (
              <SidebarNavLink
                key={item.path}
                href={item.path}
                icon={item.icon}
                isNew={item.isNewFeature}
                isImplemented={item.isAvailable}
              />
            )
          )
        )}
      </div>

      <div className="flex flex-col gap-2 p-1">
        <button className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 text-gray-700 cursor-pointer">
          <TbStarsFilled className="h-6 w-6" />
        </button>
        <button className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 text-gray-700 cursor-pointer">
          <CollapseIcon className="h-6 w-6 rotate-180" />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
