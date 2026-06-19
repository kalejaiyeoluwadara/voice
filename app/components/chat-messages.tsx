"use client";

import { useEffect, useRef } from "react";
import { Message } from "../hooks/use-chat";

interface ChatMessagesProps {
  messages: Message[];
  isThinking: boolean;
}

export default function ChatMessages({ messages, isThinking }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="text-5xl mb-4"
          style={{ filter: "drop-shadow(0 0 20px rgba(244, 114, 182, 0.3))" }}
        >
          💕
        </div>
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: "var(--au-text-primary)" }}
        >
          Hey there
        </h3>
        <p
          className="text-sm max-w-xs"
          style={{ color: "var(--au-text-muted)" }}
        >
          Tap the mic or type a message to start talking with Audrey
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="flex-shrink-0 mr-3 mt-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: "var(--au-rose-subtle)",
                  border: "1px solid rgba(244, 114, 182, 0.15)",
                  color: "var(--au-rose)",
                }}
              >
                A
              </div>
            </div>
          )}

          <div className={msg.role === "user" ? "bubble-user" : "bubble-audrey"}>
            {msg.content}
          </div>
        </div>
      ))}

      {/* Thinking indicator */}
      {isThinking && (
        <div className="flex justify-start">
          <div className="flex-shrink-0 mr-3 mt-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{
                background: "var(--au-rose-subtle)",
                border: "1px solid rgba(244, 114, 182, 0.15)",
                color: "var(--au-rose)",
              }}
            >
              A
            </div>
          </div>
          <div className="bubble-audrey">
            <div className="flex items-center gap-1.5 py-1 px-1">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
