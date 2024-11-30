import React from 'react';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: Array<{ text: string; isBot: boolean }>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="h-[600px] p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isBot={message.isBot}
          />
        ))}
      </div>
    </div>
  );
};