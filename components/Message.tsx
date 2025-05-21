"use client";

import { UserSentState } from "@/components/Contact";
import { BiCheckDouble } from "react-icons/bi";
import { MdCheck } from "react-icons/md";

interface MessageProps {
  text: string;
  time: string;
  date?: string;
  isSent: boolean;
  userSentState?: UserSentState;
  showHeader?: boolean;
  senderName?: string;
  phone?: string;
}

export const Message = ({
  text,
  time,
  date,
  isSent,
  userSentState,
  showHeader,
  senderName,
  phone,
}: MessageProps) => {
  return (
    <>
      {/* Date label, rendered only if date prop exists */}
      {date && (
        <div className="flex justify-center my-4">
          <time
            className="inline-block px-4 py-1 rounded-full bg-gray-300 text-gray-700 text-xs font-medium select-none"
            dateTime={new Date(date).toISOString()}
          >
            {date}
          </time>
        </div>
      )}

      <div className={`flex my-2 ${isSent ? "justify-end" : "justify-start"}`}>
        <article
          className={`relative max-w-xs ${
            isSent ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`p-3 rounded-xl shadow-md min-w-[7rem] text-sm break-words whitespace-pre-wrap ${
              isSent ? "bg-green-200 text-gray-900" : "bg-white text-gray-900"
            }`}
          >
            {/* Display sender info if header shown */}
            {showHeader && senderName && (
              <header className="mb-1 flex justify-between items-center text-xs font-semibold text-green-700">
                <span>{senderName}</span>
                {phone && (
                  <span className="ml-3 text-gray-600 break-all font-normal">
                    {phone}
                  </span>
                )}
              </header>
            )}

            <p>{text}</p>

            <footer className="flex items-center justify-end mt-1 text-xs text-gray-500 space-x-1">
              <time>{time}</time>
              {isSent && (
                <>
                  {userSentState === UserSentState.SENT && (
                    <MdCheck aria-label="Sent" className="ml-1 text-gray-400" />
                  )}
                  {userSentState === UserSentState.RECEIVED && (
                    <BiCheckDouble
                      aria-label="Delivered"
                      className="ml-1 text-gray-400"
                    />
                  )}
                  {userSentState === UserSentState.READ && (
                    <BiCheckDouble
                      aria-label="Read"
                      className="ml-1 text-blue-600"
                    />
                  )}
                </>
              )}
            </footer>
          </div>
        </article>
      </div>
    </>
  );
};
