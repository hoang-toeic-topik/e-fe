import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSettings } from 'react-icons/fi';
import { Message } from '../store/useChatStore';
import { ChatBox } from './ChatBox';
import { AudioRecorder } from './AudioRecorder';
import { SettingsModal } from './SettingsModal';

interface ConversationTabProps {
  messages: Message[];
  isLoading: boolean;
  onAudioRecorded: (audioBlob: Blob) => void;
}

export const ConversationTab: React.FC<ConversationTabProps> = ({
  messages,
  isLoading,
  onAudioRecorded,
}) => {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Chat Box - Main Content */}
      <div className="flex-1 overflow-hidden">
        <ChatBox messages={messages} isLoading={isLoading} />
      </div>

      {/* Bottom Control Bar */}
      <div className="flex items-center gap-3 p-4 bg-white border-t border-gray-200">
        {/* Audio Recorder */}
        <div className="flex-1">
          <AudioRecorder onAudioRecorded={onAudioRecorded} isLoading={isLoading} />
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          title="Settings"
        >
          <FiSettings size={20} />
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

