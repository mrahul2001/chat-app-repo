"use client";

import { useState, RefObject } from "react";
import { Contact, Message } from "@/utils/chatService";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageInput";
import { EmptyState } from "./EmptyChat";

interface ChatAreaProps {
  selectedContact: Contact | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  userId?: string;
  username?: string;
  userAvatar?: string | null;
  userPhone?: string;
  messagesEndRef: RefObject<HTMLDivElement>;
  onMessagesViewed?: (messageIds: string[]) => void;
}

export const ChatArea = (props: ChatAreaProps) => {
  const {
    selectedContact,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    userId,
    username,
    userAvatar,
    userPhone,
    messagesEndRef,
    onMessagesViewed
  } = props;

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollStatus = (atBottom: boolean) => {
    setIsScrolledToBottom(atBottom);
  };

  const renderChatContent = () => {
    if (!selectedContact) {
      return <EmptyState />;
    }

    return (
      <>
        <section className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            userId={userId}
            selectedContactName={selectedContact.username}
            selectedContactPhone={selectedContact.phone}
            currentUserName={username}
            currentUserPhone={userPhone}
            messagesEndRef={messagesEndRef}
            onMessagesViewed={onMessagesViewed}
            onScrollChange={handleScrollStatus}
          />
        </section>

        <footer>
          <MessageComposer
            message={newMessage}
            setMessage={setNewMessage}
            sendMessage={sendMessage}
            userName={username}
            userAvatar={userAvatar}
            scrollToBottom={scrollToBottom}
            showScrollButton={!isScrolledToBottom}
          />
        </footer>
      </>
    );
  };

  return (
    <main className="flex flex-col flex-1 h-full overflow-hidden">
      <ChatHeader selectedContact={selectedContact} />
      {renderChatContent()}
    </main>
  );
};
