"use client";

import React from "react";
import Image from "next/image";
import { IoPersonSharp } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { Contact } from "@/utils/chatService";
import { GenerateIcon } from "@/utils/Icons";

interface ChatHeaderProps {
  selectedContact: Contact | null;
}

export const ChatHeader = ({ selectedContact }: ChatHeaderProps) => {
  const handleSearchClick = () => {
    console.log("Search functionality to be implemented");
  };

  const renderContactInfo = () => {
    if (!selectedContact) return null;

    return (
      <div className="flex items-center">
        <div className="relative h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 mr-2">
          {selectedContact.avatar_url ? (
            <Image
              src={selectedContact.avatar_url}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <IoPersonSharp className="text-white h-3 w-3 sm:h-4 sm:w-4 text-sm" />
          )}
        </div>

        <div className="flex flex-col max-w-[200px] sm:max-w-none">
          <h3 className="text-xs sm:text-sm font-semibold truncate">
            {selectedContact.username}
          </h3>
          <p className="text-xs font-normal text-gray-400 truncate">
            {selectedContact.phone || "Click here for contact info"}
          </p>
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    if (!selectedContact) return null;

    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <GenerateIcon className="h-4 w-4 text-gray-700 cursor-pointer" />
          </div>
        </div>
        <div className="relative">
          <button
            className="p-1.5 rounded-full text-gray-700"
            onClick={handleSearchClick}
          >
            <FiSearch className="h-4 w-4 cursor-pointer" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between h-14 px-2 sm:px-3 border-b border-gray-200 bg-white">
      {renderContactInfo()}
      {renderActionButtons()}
    </div>
  );
};
