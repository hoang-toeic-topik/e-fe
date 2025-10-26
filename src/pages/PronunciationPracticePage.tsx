import React, { useEffect, useState } from 'react';
import { usePronunciationStore, PronunciationMessage } from '../store/usePronunciationStore';
import { teacherAPI } from '../services/api';
import { PronunciationLayout } from '../components/PronunciationLayout';

export const PronunciationPracticePage: React.FC = () => {
  const {
    sessionId,
    messages,
    isLoading,
    voiceId,
    language,
    hasGreeting,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    setHasGreeting,
  } = usePronunciationStore();

  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Add initial greeting message only on first load
  useEffect(() => {
    // Only run once when component is hydrated and no greeting has been shown
    if (isHydrated && messages.length === 0 && !hasGreeting) {
      const greetingMessage: PronunciationMessage = {
        id: `msg_greeting_${Date.now()}`,
        type: 'ai',
        text: "Welcome to Pronunciation Practice! 🎤 Let's work on your pronunciation. Please read the sentence I'll give you.",
        timestamp: new Date(),
      };
      addMessage(greetingMessage);
      setHasGreeting(true);
    }
  }, [isHydrated, hasGreeting, addMessage, setHasGreeting, messages.length]);

  const handleAudioRecorded = async (audioBlob: Blob) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message with audio blob
      const userMessage: PronunciationMessage = {
        id: `msg_${Date.now()}`,
        type: 'user',
        text: 'Processing audio...',
        timestamp: new Date(),
        audioBlob: audioBlob,
      };
      addMessage(userMessage);

      // Send audio to backend for pronunciation analysis
      const response = await teacherAPI.chatWithAudio(
        audioBlob,
        sessionId,
        voiceId,
        language
      );

      // Update user message with transcribed text
      updateMessage(userMessage.id, {
        text: response.feedback.user_text || 'Your message',
      });

      // Create AI response message with audio and feedback
      const aiMessage: PronunciationMessage = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        text: response.feedback.ai_response,
        timestamp: new Date(),
        audioBlob: response.audioBlob,
        isNewMessage: true, // Mark as new to show typing animation
      };
      addMessage(aiMessage);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PronunciationLayout
      messages={messages}
      isLoading={isLoading}
      onAudioRecorded={handleAudioRecorded}
      title="Pronunciation Practice"
      subtitle="Improve your pronunciation with detailed feedback"
    />
  );
};

