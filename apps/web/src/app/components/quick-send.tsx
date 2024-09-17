import React, { useRef } from "react";
import Image from "next/image";

interface Contact {
  handle: string;
  avatarUrl: string;
}

interface QuickSendProps {
  contacts: Contact[];
  onSend: (handle: string) => void;
}

const QuickSend: React.FC<QuickSendProps> = ({ contacts, onSend }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="section-title mb-4">Contacts</h3>
      <div className="relative">
        <div
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          ref={scrollContainerRef}
          style={{ scrollSnapType: "x mandatory" }}
        >
          {contacts.map((contact) => (
            <div
              className="flex flex-col items-center flex-shrink-0"
              key={contact.handle}
              style={{ scrollSnapAlign: "start" }}
            >
              <button
                className="w-16 h-16 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent transition-shadow duration-200"
                onClick={() => {
                  onSend(contact.handle);
                }}
              >
                <Image
                  alt={`Avatar of ${contact.handle}`}
                  height={64}
                  src={contact.avatarUrl}
                  width={64}
                />
              </button>
              <span className="text-xs text-text-secondary mt-2">
                {contact.handle}
              </span>
            </div>
          ))}
        </div>
        {contacts.length > 3 && (
          <>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-card-background rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => {
                scroll("left");
              }}
            >
              <svg
                className="h-6 w-6 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-card-background rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => {
                scroll("right");
              }}
            >
              <svg
                className="h-6 w-6 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickSend;
