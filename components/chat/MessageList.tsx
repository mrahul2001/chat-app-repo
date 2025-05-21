"use client";

import { Message as MessageType } from "@/utils/chatService";
import { Message } from "@/components/Message";
import { UserSentState } from "@/components/Contact";
import { RefObject, useEffect, useRef, useState } from "react";

interface MessageListProps {
  messages: MessageType[];
  userId?: string;
  selectedContactName?: string;
  selectedContactPhone?: string;
  currentUserName?: string;
  currentUserPhone?: string;
  messagesEndRef: RefObject<HTMLDivElement>;
  onMessagesViewed?: (messageIds: string[]) => void;
  onScrollChange?: (isAtBottom: boolean) => void;
}

const formatMessageDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  return date.toLocaleDateString();
};

const isSameDay = (date1: string, date2: string): boolean => {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const MessageList = ({
  messages,
  userId,
  selectedContactName,
  selectedContactPhone,
  currentUserName,
  currentUserPhone,
  messagesEndRef,
  onMessagesViewed,
  onScrollChange,
}: MessageListProps) => {
  const messageSetViewed = useState<Set<string>>(new Set());
  const [viewedMessageIds, setViewedMessageIds] = messageSetViewed;
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const messageElementRefs = useRef<Map<string, HTMLElement>>(new Map());
  const containerElementRef = useRef<HTMLElement>(null);

  // Scroll handler to detect if user is near bottom
  const handleScrollEvent = () => {
    if (!containerElementRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerElementRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsScrolledToBottom(nearBottom);

    if (onScrollChange) {
      onScrollChange(nearBottom);
    }
  };

  useEffect(() => {
    if (!userId || !onMessagesViewed) return;

    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
    }

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const newlyViewed: string[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const msgId = entry.target.getAttribute('data-message-id');
            if (msgId && !viewedMessageIds.has(msgId)) {
              newlyViewed.push(msgId);
              setViewedMessageIds((prev) => new Set([...prev, msgId]));
            }
          }
        });

        if (newlyViewed.length > 0) {
          onMessagesViewed(newlyViewed);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    messageElementRefs.current.forEach((element) => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.observe(element);
      }
    });

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [userId, onMessagesViewed, messages, viewedMessageIds, setViewedMessageIds]);

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    setIsScrolledToBottom(true);
  }, [messages, messagesEndRef]);

  // Add/remove scroll event listener
  useEffect(() => {
    const container = containerElementRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
      return () => {
        container.removeEventListener('scroll', handleScrollEvent);
      };
    }
  }, []);

  return (
    <section
      ref={containerElementRef}
      className="flex-1 overflow-y-auto p-4 h-full bg-stone-50"
      style={{
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        backgroundImage: "url('/whatsapp-bg.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
      }}
      aria-label="Message conversation"
    >
      <div className="flex flex-col min-h-full">
        <div className="flex-1">
          {messages.map((msg, index) => {
            const shouldShowDate =
              index === 0 || !isSameDay(msg.created_at, messages[index - 1].created_at);
            const dateLabel = shouldShowDate ? formatMessageDate(msg.created_at) : undefined;

            const isGroupStart =
              index === 0 ||
              messages[index - 1].sender_id !== msg.sender_id ||
              shouldShowDate;

            return (
              <article
                key={msg.id}
                className={shouldShowDate && dateLabel ? 'date-section' : ''}
                ref={(el) => {
                  if (el && msg.receiver_id === userId && msg.status !== 'read') {
                    messageElementRefs.current.set(msg.id, el);
                  }
                }}
                data-message-id={msg.id}
              >
                {shouldShowDate && dateLabel && (
                  <header className="flex justify-center my-3">
                    <time
                      className="text-xs bg-gray-200 px-3 py-1 rounded-full text-gray-600"
                      dateTime={new Date(msg.created_at).toISOString().split('T')[0]}
                    >
                      {dateLabel}
                    </time>
                  </header>
                )}
                <Message
                  text={msg.content}
                  time={new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  date={undefined} // handled in header
                  isSent={msg.sender_id === userId}
                  userSentState={
                    msg.sender_id === userId
                      ? msg.status === 'read'
                        ? UserSentState.READ
                        : msg.status === 'received'
                        ? UserSentState.RECEIVED
                        : UserSentState.SENT
                      : undefined
                  }
                  showHeader={isGroupStart}
                  senderName={msg.sender_id === userId ? currentUserName : selectedContactName}
                  phone={msg.sender_id === userId ? currentUserPhone : selectedContactPhone}
                />
              </article>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
};
