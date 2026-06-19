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
          className="text-6xl mb-4 animate-bounce"
          style={{ filter: "drop-shadow(0 0 20px rgba(255, 252, 0, 0.4))" }}
        >
          👻
        </div>
        <h3 className="text-lg font-bold mb-2 text-yellow-400 tracking-wide">
          Snap Audrey
        </h3>
        <p className="text-sm max-w-xs" style={{ color: "var(--au-text-secondary)" }}>
          Audrey is on summer break in Lagos! Say hey to start the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        return (
          <div key={msg.id} className="flex justify-start max-w-[90%]">
            {/* Snapchat "Saved in Chat" Style Left Bordered Card */}
            <div
              className={`border-l-[3.5px] pl-3.5 py-1.5 pr-4 rounded-r-xl transition-all duration-200 ${
                isUser
                  ? "border-sky-400 bg-sky-500/5 hover:bg-sky-500/10"
                  : "border-rose-400 bg-rose-500/5 hover:bg-rose-500/10"
              }`}
              style={{
                boxShadow: isUser
                  ? "inset 0 0 10px rgba(56, 189, 248, 0.02)"
                  : "inset 0 0 10px rgba(251, 113, 133, 0.02)",
              }}
            >
              {/* Sender name badge */}
              <span
                className={`text-xs font-black tracking-widest uppercase block mb-0.5 ${
                  isUser ? "text-sky-400" : "text-rose-400"
                }`}
              >
                {isUser ? "Me" : "Audrey"}
              </span>

              {/* Message text */}
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ color: "var(--au-text-primary)" }}
              >
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}

      {/* Thinking indicator */}
      {isThinking && (
        <div className="flex justify-start max-w-[90%]">
          <div
            className="border-l-[3.5px] border-rose-400 bg-rose-500/5 pl-3.5 py-2 pr-5 rounded-r-xl"
            style={{ boxShadow: "inset 0 0 10px rgba(251, 113, 133, 0.02)" }}
          >
            <span className="text-xs font-black tracking-widest uppercase block text-rose-400 mb-1">
              Audrey
            </span>
            <div className="flex items-center gap-1.5 py-1">
              <div className="typing-dot" style={{ background: "var(--au-rose)" }} />
              <div className="typing-dot" style={{ background: "var(--au-rose)" }} />
              <div className="typing-dot" style={{ background: "var(--au-rose)" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
