"use client";

import React, { useState, FormEvent } from "react";
import styles from "./ChatInput.module.css";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled} className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
