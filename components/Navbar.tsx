"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase-client";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { LuChevronsUpDown, LuCircleHelp } from "react-icons/lu";
import { MdOutlineInstallDesktop } from "react-icons/md";
import { TbRefreshDot } from "react-icons/tb";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoMdNotificationsOff } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const currentPath = usePathname();

  // Hide Navbar on auth pages
  if (currentPath.includes("/auth")) return null;

  const logoutUser = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  return (
    <header className="w-full h-12 border-b border-gray-300 flex items-center justify-between px-5 z-50 bg-white">
      {/* Left - App Label */}
      <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm select-none">
        <IoChatbubbleEllipses className="w-5 h-5" />
        <span className="uppercase tracking-wide">Chats</span>
      </div>

      {/* Mobile menu toggle */}
      <button
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Desktop utilities */}
      <nav className="hidden md:flex items-center space-x-3 overflow-x-auto max-w-full pr-2">
        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 whitespace-nowrap transition">
          <TbRefreshDot className="w-4 h-4" />
          Refresh
        </button>

        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 whitespace-nowrap transition">
          <LuCircleHelp className="w-4 h-4" />
          Help
        </button>

        <div className="flex items-center gap-1 px-3 py-1 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 whitespace-nowrap cursor-default select-none">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
          <span>5 / 6 phones</span>
          <LuChevronsUpDown className="w-3 h-3" />
        </div>

        <button
          title="Install Desktop App"
          className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          <MdOutlineInstallDesktop className="w-5 h-5" />
        </button>

        <button
          title="Notifications Off"
          className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          <IoMdNotificationsOff className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition cursor-pointer whitespace-nowrap">
          <BsStars className="w-5 h-5 text-yellow-500 p-[1px]" />
          <CiBoxList className="w-5 h-5" />
        </div>

        <button
          onClick={logoutUser}
          className="px-3 py-1.5 text-sm font-semibold text-red-600 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition whitespace-nowrap"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
