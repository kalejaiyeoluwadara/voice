"use client";

import { useState, useRef } from "react";

interface TextChatInputProps {
  onSend: (text: string) => void;
  onCameraClick?: () => void;
  disabled: boolean;
}

export default function TextChatInput({
  onSend,
  onCameraClick,
  disabled,
}: TextChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-3.5 w-full">
      {/* Left Camera Button */}
      <button
        type="button"
        onClick={onCameraClick}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/30 text-zinc-300 hover:text-white transition-all select-none cursor-pointer flex-shrink-0"
        aria-label="Snap camera"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>

      {/* Input Capsule */}
      <form
        onSubmit={handleSubmit}
        className="relative flex-1 flex items-center bg-zinc-800/50 border border-zinc-700/30 rounded-full pl-4 pr-1.5 py-1 transition-all focus-within:border-yellow-400/50 focus-within:bg-zinc-800/80"
      >
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500 w-full py-2 pr-12 focus:ring-0"
          placeholder="Send a Chat"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          id="chat-input"
        />

        {/* Right Action Trigger */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {text.trim() ? (
            /* Snapchat Blue Bold Send word button */
            <button
              type="submit"
              disabled={disabled}
              className="text-sm font-black tracking-wider text-sky-400 hover:text-sky-300 transition-colors uppercase px-3 py-1 cursor-pointer select-none"
              id="send-btn"
            >
              Send
            </button>
          ) : (
            /* Micro utilities when not typing */
            <div className="flex items-center gap-2 text-zinc-500 px-2 select-none pointer-events-none">
              {/* Mic visual node */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
              {/* Cards visual node */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
