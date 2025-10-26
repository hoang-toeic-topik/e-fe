import React from 'react';
import { Message } from '../store/useChatStore';
import { MainLayout } from './layout/MainLayout';
import { ChatContainer } from './shared/ChatContainer';
import { AudioRecorder } from './AudioRecorder';

interface PronunciationLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onAudioRecorded: (audioBlob: Blob) => void;
  title?: string;
  subtitle?: string;
}

/**
 * PronunciationLayout - Reusable pronunciation practice interface component
 * Similar to ChatLayout but specifically for pronunciation practice mode
 * Wraps MainLayout + ChatContainer for consistent styling
 */
export const PronunciationLayout: React.FC<PronunciationLayoutProps> = ({
  messages,
  isLoading,
  onAudioRecorded,
  title = 'Pronunciation Practice',
  subtitle = 'Improve your pronunciation with detailed feedback',
}) => {
  return (
    <MainLayout title={title} subtitle={subtitle}>
      <ChatContainer messages={messages} isLoading={isLoading}>
        <AudioRecorder onAudioRecorded={onAudioRecorded} isLoading={isLoading} />
      </ChatContainer>
    </MainLayout>
  );
};

