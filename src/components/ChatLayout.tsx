import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSettings } from 'react-icons/fi';
import { Message } from '../store/useChatStore';
import { ChatBox } from './ChatBox';
import { AudioRecorder } from './AudioRecorder';
import { SettingsModal } from './SettingsModal';

interface ChatLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onAudioRecorded: (audioBlob: Blob) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  isLoading,
  onAudioRecorded,
}) => {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);

  // Check if we're still in greeting phase (only greeting message, no user messages)
  const isGreetingPhase = messages.length === 1 && messages[0].type === 'ai' && !messages[0].audioBlob && !messages[0].audioUrl;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('app_title')}</h1>
          <p className="text-sm text-gray-500">{t('app_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          {isLoading && (
            <button
              disabled
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg animate-pulse"
              title="Processing..."
            >
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              Recording...
            </button>
          )}
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            title="Settings"
          >
            <FiSettings size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatBox messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Area - Hidden during greeting phase */}
      {!isGreetingPhase && (
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <AudioRecorder onAudioRecorded={onAudioRecorded} isLoading={isLoading} />
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

