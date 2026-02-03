"use client";

import React from "react";
import styles from "./MessageList.module.css";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <div className={styles.container}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`${styles.message} ${msg.role === "user" ? styles.user : styles.ai}`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
