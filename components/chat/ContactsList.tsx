"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiX } from "react-icons/fi";
import { MdOutlineFilterList } from "react-icons/md";
import { HiFolderArrowDown } from "react-icons/hi2";
import { ContactItem } from "@/components/Contact";
import { Contact } from "@/utils/chatService";
import { NewChatIcon } from "@/utils/Icons";

interface ContactsListProps {
  contacts: Contact[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchUsers: () => void;
  handleContactSelect: (contact: Contact) => void;
  handleContactDeselect?: () => void;
  handleAddContact: (contactId: string) => void;
  selectedContact: Contact | null;
  searchResults: Contact[];
  isSearching: boolean;
  permissionError: boolean;
  loadContacts: () => void;
}

export const ContactsList = ({
  contacts,
  searchQuery,
  setSearchQuery,
  handleContactSelect,
  handleContactDeselect,
  selectedContact,
  permissionError,
  loadContacts,
}: ContactsListProps) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const contactRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleToggleSearchInput = () => {
    setShowSearchInput((prev) => !prev);
    if (showSearchInput) setSearchQuery("");
  };

  const handleToggleFilter = () => {
    setFilterUnread((prev) => !prev);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && handleContactDeselect) {
      handleContactDeselect();
    }
  };

  const handleCancelSearch = () => {
    setSearchQuery("");
    setShowSearchInput(false);
  };

  const displayedContacts = contacts.filter((contact) => {
    const unreadOk =
      !filterUnread || (contact.unreadCount && contact.unreadCount > 0);
    const searchOk =
      !showSearchInput ||
      !searchQuery.trim() ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase());
    return unreadOk && searchOk;
  });

  useEffect(() => {
    if (selectedContact && contactRefs.current.has(selectedContact.id)) {
      const el = contactRefs.current.get(selectedContact.id);
      setTimeout(() => {
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [selectedContact]);

  // Debounced placeholder for future async search
  useEffect(() => {
    const timeout = setTimeout(() => { }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, showSearchInput]);

  const renderHeader = () => (
    <div className="h-14 px-2 flex items-center justify-between bg-gray-50 sticky top-0 z-10 border-b border-gray-200 flex-shrink-0">
      <div className="flex">
        <div className="flex items-center px-1.5 py-1 text-gray-600 font-semibold text-xs rounded-md cursor-default">
          <HiFolderArrowDown
            className={`h-4 w-4 mr-1 ${filterUnread ? "text-green-600" : "text-gray-600"
              }`}
          />
          <span className={filterUnread ? "text-green-600" : "text-gray-600"}>
            {filterUnread ? "Custom Filter" : "Inbox"}
          </span>
        </div>
        <button className="ml-1 flex items-center px-1.5 py-1 text-gray-600 text-xs cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400 transition-all duration-200">
          Save
        </button>
      </div>
      <div className="flex gap-1 sm:gap-2">
        {renderSearchButton()}
        {renderFilterButton()}
      </div>
    </div>
  );

  const renderSearchButton = () => (
    <div className="relative">
      <button
        className={`flex items-center px-1.5 py-1 cursor-pointer text-xs border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400 ${showSearchInput && searchQuery.trim()
            ? "text-green-600 font-semibold"
            : "text-gray-600"
          }`}
        onClick={handleToggleSearchInput}
      >
        <FiSearch
          className={`h-3 w-3 mr-1 stroke-3 ${showSearchInput && searchQuery.trim()
              ? "text-green-600"
              : "text-gray-600"
            }`}
        />
        {showSearchInput && searchQuery.trim() ? "Searching" : "Search"}
      </button>
      {showSearchInput && searchQuery.trim() && (
        <button
          className="absolute -top-2 -right-2 bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs hover:bg-green-500 transition-colors"
          onClick={handleCancelSearch}
        >
          <FiX className="h-3 w-3" />
        </button>
      )}
    </div>
  );

  const renderFilterButton = () => (
    <div className="relative">
      <button
        className={`flex items-center px-1.5 py-1 text-xs cursor-pointer border ${filterUnread ? "text-green-600 font-semibold" : "text-gray-600"
          } border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400`}
        onClick={handleToggleFilter}
      >
        <MdOutlineFilterList
          className={`h-4 w-4 mr-1 ${filterUnread ? "text-green-600" : "text-gray-600"
            }`}
        />
        {filterUnread ? "Filtered" : "Filter"}
      </button>
      {filterUnread && (
        <button
          className="absolute -top-2 -right-2 bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs hover:bg-green-500"
          onClick={handleToggleFilter}
        >
          <FiX className="h-3 w-3" />
        </button>
      )}
    </div>
  );

  const renderSearchInput = () =>
    showSearchInput && (
      <div className="px-2 pt-2 flex-shrink-0">
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-8 pr-10 py-1.5 text-sm rounded-md border border-gray-200 focus:ring-1 focus:ring-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
          <FiSearch className="absolute left-2.5 top-2 text-gray-400" size={15} />
          <button
            className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            onClick={searchQuery.trim() ? handleCancelSearch : () => setShowSearchInput(false)}
          >
            <FiX size={15} />
          </button>
        </div>
      </div>
    );

  const renderContactsList = () => (
    <div
      className="flex-1 overflow-y-auto"
      style={{ overscrollBehavior: "contain" }}
      onClick={handleBackgroundClick}
    >
      {permissionError ? (
        <div className="p-4 text-center text-xs text-red-500">
          Failed to load contacts. Permission denied.
          <button
            onClick={loadContacts}
            className="block mt-2 text-blue-500 underline"
          >
            Try Again
          </button>
        </div>
      ) : displayedContacts.length > 0 ? (
        displayedContacts.map((contact) => (
          <div
            key={contact.id}
            ref={(el) => {
              if (el) contactRefs.current.set(contact.id, el);
            }}
            onClick={() => handleContactSelect(contact)}
            className="cursor-default"
          >
            <ContactItem
              name={contact.username}
              latestMessage={contact.latestMessage || "Send new message"}
              phone={contact.phone || ""}
              unreadCount={contact.unreadCount && contact.unreadCount > 0 ? contact.unreadCount : undefined}              
              date={contact.lastMessageDate || ""}
              avatar={contact.avatar_url || undefined}
              userSentState={contact.userSentState}
              isActive={selectedContact?.id === contact.id}
            />
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500 text-xs sm:text-sm">
          {filterUnread
            ? "No unread messages."
            : showSearchInput && searchQuery
              ? "No matches found."
              : "No contacts yet. Search to start chatting."}
        </div>
      )}
    </div>
  );

  const renderChatButton = () => (
    <div className="absolute bottom-4 right-4 z-10">
      <button className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300">
        <NewChatIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );

  return (
    <div className="border-r border-gray-200 h-full flex flex-col relative">
      {renderHeader()}
      {renderSearchInput()}
      {renderContactsList()}
      {renderChatButton()}
    </div>
  );
};
