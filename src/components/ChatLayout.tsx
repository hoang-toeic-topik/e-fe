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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('app_title')}</h1>
          <p className="text-xs sm:text-sm text-gray-500">{t('app_subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator */}
          {isLoading && (
            <button
              disabled
              className="hidden sm:flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg animate-pulse text-xs sm:text-sm"
              title="Processing..."
            >
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              Recording...
            </button>
          )}
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            title="Settings"
          >
            <FiSettings size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Main Container - Centered */}
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-4">
        {/* Chat Window Container */}
        <div className="w-full max-w-2xl h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 overflow-hidden">
            <ChatBox messages={messages} isLoading={isLoading} />
          </div>

          {/* Input Area - Always visible */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-6 bg-white flex flex-col items-center justify-center">
            <AudioRecorder onAudioRecorded={onAudioRecorded} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

