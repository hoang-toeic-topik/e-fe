import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlay, FiPause } from 'react-icons/fi';
import { Message } from '../store/useChatStore';
import { TypingAnimation } from './TypingAnimation';

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlayAudio = (message: Message) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (message.audioUrl) {
      audioRef.current = new Audio(message.audioUrl);
      audioRef.current.onplay = () => setPlayingMessageId(message.id);
      audioRef.current.onended = () => setPlayingMessageId(null);
      audioRef.current.play();
    } else if (message.audioBlob) {
      const url = URL.createObjectURL(message.audioBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onplay = () => setPlayingMessageId(message.id);
      audioRef.current.onended = () => setPlayingMessageId(null);
      audioRef.current.play();
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingMessageId(null);
    }
  };

  useEffect(() => {
    scrollToBottom();

    // Auto-play AI message audio when new AI message is added
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'ai' && lastMessage.id !== lastMessageIdRef.current && (lastMessage.audioBlob || lastMessage.audioUrl)) {
        lastMessageIdRef.current = lastMessage.id;
        // Delay auto-play slightly to ensure UI is ready
        setTimeout(() => {
          handlePlayAudio(lastMessage);
        }, 500);
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <p className="text-gray-500 text-lg">{t('messages.welcome') || 'Start a conversation'}</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">
                  {msg.type === 'ai' ? (
                    <TypingAnimation text={msg.text} speed={20} />
                  ) : (
                    msg.text
                  )}
                </p>

                {/* Audio Player for AI messages */}
                {msg.type === 'ai' && (msg.audioUrl || msg.audioBlob) && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        playingMessageId === msg.id
                          ? handleStopAudio()
                          : handlePlayAudio(msg)
                      }
                      className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                        playingMessageId === msg.id
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {playingMessageId === msg.id ? (
                        <>
                          <FiPause size={14} /> Pause
                        </>
                      ) : (
                        <>
                          <FiPlay size={14} /> Play
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Audio Replay for User messages */}
                {msg.type === 'user' && (msg.audioUrl || msg.audioBlob) && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        playingMessageId === msg.id
                          ? handleStopAudio()
                          : handlePlayAudio(msg)
                      }
                      className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                        playingMessageId === msg.id
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-400 text-white hover:bg-blue-500'
                      }`}
                    >
                      {playingMessageId === msg.id ? (
                        <>
                          <FiPause size={14} /> Stop
                        </>
                      ) : (
                        <>
                          <FiPlay size={14} /> Replay
                        </>
                      )}
                    </button>
                  </div>
                )}

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

