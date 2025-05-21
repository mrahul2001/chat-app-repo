"use client";

import { HiFolderArrowDown } from "react-icons/hi2";

export const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
      <HiFolderArrowDown size={48} className="mb-3" />
      <h2 className="text-xl font-semibold mb-1">No conversation selected</h2>
      <p className="text-sm">Choose a contact to begin chatting</p>
    </div>
  );
};
