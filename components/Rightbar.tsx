"use client";

import { CollapseIcon, IntegrationIcon, MembersIcon, OverviewIcon, PropertiesIcon } from "@/utils/Icons";
import { Contact } from "@/utils/chatService";
import { IconType } from "react-icons";
import { MdAlternateEmail } from "react-icons/md";
import { RiFolderImageFill, RiListSettingsLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";

interface SidebarButton {
  icon?: IconType;
  isActive?: boolean;
  isAvailable?: boolean;
}

interface RightSidebarProps {
  selectedContact: Contact | null;
}

const sidebarButtons: SidebarButton[] = [
  { icon: CollapseIcon, isAvailable: false },
  { icon: LuRefreshCw, isAvailable: true },
  { icon: FiEdit3, isAvailable: false },
  { icon: OverviewIcon, isAvailable: false },
  { icon: PropertiesIcon, isAvailable: false },
  { icon: IntegrationIcon, isAvailable: false },
  { icon: MembersIcon, isAvailable: false },
  { icon: MdAlternateEmail, isAvailable: false },
  { icon: RiFolderImageFill, isAvailable: false },
  { icon: RiListSettingsLine, isAvailable: false },
];

const Rightbar: React.FC<RightSidebarProps> = ({ selectedContact }) => {
  return (
    <section className="w-16 border-l border-gray-300 pt-12 px-3 flex flex-col gap-5 h-full bg-white">
      {sidebarButtons.map((button, idx) =>
        button.icon ? (
          <button
            key={idx}
            aria-label="Sidebar action"
            disabled={!button.isAvailable}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-150
              ${button.isAvailable ? "text-gray-600 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}`}
          >
            <button.icon className="h-6 w-6" />
          </button>
        ) : null
      )}
    </section>
  );
};

export default Rightbar;
