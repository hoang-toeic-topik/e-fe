import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../store/useChatStore';
import { ChatBox } from './ChatBox';
import { AudioRecorder } from './AudioRecorder';

interface ConversationTabProps {
  messages: Message[];
  isLoading: boolean;
  topic?: string;
  onAudioRecorded: (audioBlob: Blob) => void;
}

export const ConversationTab: React.FC<ConversationTabProps> = ({
  messages,
  isLoading,
  topic,
  onAudioRecorded,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Topic Info */}
      {topic && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-600">
            {t('topic.current_topic') || 'Current Topic'}:
          </p>
          <p className="text-lg font-semibold text-blue-600 capitalize">{topic}</p>
        </div>
      )}

      {/* Chat Box */}
      <ChatBox messages={messages} isLoading={isLoading} />

      {/* Audio Recorder */}
      <AudioRecorder onAudioRecorded={onAudioRecorded} isLoading={isLoading} />

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">💡 {t('tips.title') || 'Tips'}</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• {t('tips.speak_clearly') || 'Speak clearly and naturally'}</li>
          <li>• {t('tips.complete_sentences') || 'Try to use complete sentences'}</li>
          <li>• {t('tips.relax') || 'Relax and enjoy the conversation'}</li>
        </ul>
      </div>
    </div>
  );
};

