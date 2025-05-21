"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { BsStars } from "react-icons/bs";

interface SidebarNavLinkProps {
  href: string;
  icon: IconType;
  isNew?: boolean;
  isImplemented?: boolean;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon: Icon,
  isNew = false,
  isImplemented = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tooltip, setTooltip] = useState(false);

  const activeLink = pathname === href;

  const onClick = (event: React.MouseEvent) => {
    if (!isImplemented && href !== "/chats") {
      event.preventDefault();
      setTooltip(true);
      setTimeout(() => setTooltip(false), 2200);
    }
  };

  return (
    <div onMouseLeave={() => setTooltip(false)} className="relative">
      <Link href={isImplemented || href === "/chats" ? href : "#"} onClick={onClick}>
        <div
          className={`flex justify-center items-center p-1.5 rounded-md cursor-pointer select-none transition-colors duration-150 ${
            activeLink ? "bg-green-300 text-green-900" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Icon className="w-5 h-5" />
          {isNew && (
            <BsStars className="absolute top-0.5 right-0.5 h-3 w-3 text-yellow-400" />
          )}
        </div>
      </Link>
      {tooltip && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 select-none pointer-events-none">
          Feature coming soon
        </span>
      )}
    </div>
  );
};

export default SidebarNavLink;
