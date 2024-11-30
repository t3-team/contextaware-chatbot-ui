import React from 'react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isBot
            ? 'bg-gray-200 text-gray-800'
            : 'bg-blue-500 text-white'
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};