import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlay, FiPause } from 'react-icons/fi';
import { Message } from '../../store/useChatStore';
import { TypingAnimation } from '../TypingAnimation';

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
  onPlayAudio: (message: Message) => void;
  onStopAudio: () => void;
  playingMessageId: string | null;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  isLoading,
  onPlayAudio,
  onStopAudio,
  playingMessageId,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-4">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤖</div>
            <p className="text-gray-500 text-base sm:text-lg">{t('messages.welcome') || 'Start a conversation'}</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">
                {msg.type === 'ai' && msg.isNewMessage ? (
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
                        ? onStopAudio()
                        : onPlayAudio(msg)
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
                        ? onStopAudio()
                        : onPlayAudio(msg)
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
    </div>
  );
};

