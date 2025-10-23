import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../store/useChatStore';

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>{t('messages.welcome')}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.correctedText && msg.type === 'ai' && (
                  <p className="text-xs mt-2 opacity-75">
                    {t('feedback.corrections')}: {msg.correctedText}
                  </p>
                )}
                {msg.feedback && msg.type === 'ai' && (
                  <div className="text-xs mt-2 space-y-1">
                    {msg.feedback.pronunciation && (
                      <p>
                        🎤 {t('feedback.pronunciation')}: {msg.feedback.pronunciation.score?.toFixed(2)}
                      </p>
                    )}
                    {msg.feedback.accent && (
                      <p>🌍 {t('feedback.accent')}: {msg.feedback.accent.accent}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

