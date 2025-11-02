import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlay, FiPause, FiBarChart2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Message } from '../../store/useChatStore';
import { PronunciationMessage } from '../../store/usePronunciationStore';
import { TypingAnimation } from '../TypingAnimation';
import { FeedbackPanel } from '../FeedbackPanel';

// Accept both Message and PronunciationMessage types
type MessageType = Message | PronunciationMessage;

interface MessageDisplayProps {
  messages: MessageType[];
  isLoading: boolean;
  onPlayAudio: (message: MessageType) => void;
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
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);
  console.log('[MessageDisplay] Rendering with messages count:', messages.length, 'messages:', messages);

  // Check if message has feedback (PronunciationMessage)
  const hasFeedback = (msg: MessageType): msg is PronunciationMessage => {
    return 'feedback' in msg && msg.feedback !== undefined;
  };

  // Get the last AI message ID to determine which one should show typing animation
  const getLastAIMessageId = (): string | null => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'ai') {
        return messages[i].id;
      }
    }
    return null;
  };

  const lastAIMessageId = getLastAIMessageId();

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
          <div key={msg.id} className="mb-3 sm:mb-4">
            <div
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">
                  {msg.type === 'ai' && msg.id === lastAIMessageId && msg.isNewMessage ? (
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

                {/* Analyze Button for AI messages with feedback */}
                {msg.type === 'ai' && (
                  <>
                    {console.log('[MessageDisplay] AI Message:', msg.id, 'has feedback:', 'feedback' in msg, 'feedback value:', (msg as any).feedback)}
                    {hasFeedback(msg) && msg.feedback && (
                      <button
                        onClick={() => setExpandedFeedbackId(expandedFeedbackId === msg.id ? null : msg.id)}
                        className="mt-2 flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-medium"
                      >
                        <FiBarChart2 size={12} />
                        Analyze
                        {expandedFeedbackId === msg.id ? (
                          <FiChevronUp size={12} />
                        ) : (
                          <FiChevronDown size={12} />
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Feedback Panel - Inline below message */}
            {msg.type === 'ai' && hasFeedback(msg) && msg.feedback && (
              <div className="flex justify-start mt-1">
                <div className="max-w-xs sm:max-w-sm md:max-w-md w-full">
                  <FeedbackPanel
                    feedback={msg.feedback}
                    isExpanded={expandedFeedbackId === msg.id}
                  />
                </div>
              </div>
            )}
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

