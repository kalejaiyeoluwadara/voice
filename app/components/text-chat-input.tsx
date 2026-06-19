"use client";

import { useState, useRef } from "react";

interface TextChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function TextChatInput({ onSend, disabled }: TextChatInputProps) {
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
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className="chat-input"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        id="chat-input"
      />
      <button
        type="submit"
        className="send-btn"
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        id="send-btn"
      >
        {/* Heart send icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </form>
  );
}
