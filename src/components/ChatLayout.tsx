import React from 'react';
import { Message } from '../store/useChatStore';
import { PronunciationMessage } from '../store/usePronunciationStore';
import { MainLayout } from './layout/MainLayout';
import { ChatContainer } from './shared/ChatContainer';
import { AudioRecorder } from './AudioRecorder';

// Accept both Message and PronunciationMessage types
type MessageType = Message | PronunciationMessage;

interface ChatLayoutProps {
  messages: MessageType[];
  isLoading: boolean;
  onAudioRecorded: (audioBlob: Blob) => void;
  title?: string;
  subtitle?: string;
}

/**
 * ChatLayout - Reusable chat interface component
 * Used for both AI Talk and Pronunciation Practice modes
 * Wraps MainLayout + ChatContainer for consistent styling
 */
export const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  isLoading,
  onAudioRecorded,
  title = 'Chat',
  subtitle = 'Have a conversation',
}) => {
  return (
    <MainLayout title={title} subtitle={subtitle}>
      <ChatContainer messages={messages} isLoading={isLoading}>
        <AudioRecorder onAudioRecorded={onAudioRecorded} isLoading={isLoading} />
      </ChatContainer>
    </MainLayout>
  );
};

