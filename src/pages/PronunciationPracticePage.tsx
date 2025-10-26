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
      console.log('[1] Audio received:', { size: audioBlob.size, type: audioBlob.type });
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
      console.log('[2] Adding user message:', userMessage);
      addMessage(userMessage);

      // Send audio to backend for pronunciation analysis
      console.log('[3] Sending audio to API with:', { sessionId, voiceId, language });
      const response = await teacherAPI.chatWithAudio(
        audioBlob,
        sessionId,
        voiceId,
        language
      );
      console.log('[4] API response received:', response);
      console.log('[4a] Response feedback structure:', response.feedback);
      console.log('[4b] aiResponse value:', response.feedback.aiResponse);
      console.log('[4c] userText value:', response.feedback.userText);

      // Update user message with transcribed text
      console.log('[5] Updating user message with transcribed text:', response.feedback.userText);
      updateMessage(userMessage.id, {
        text: response.feedback.userText || 'Your message',
      });

      // Create AI response message with audio and feedback
      const aiMessage: PronunciationMessage = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        text: response.feedback.aiResponse,
        timestamp: new Date(),
        audioBlob: response.audioBlob,
        isNewMessage: true, // Mark as new to show typing animation
        feedback: response.feedback, // ✅ ADD FEEDBACK HERE!
      };
      console.log('[6] Adding AI message:', aiMessage);
      console.log('[6a] AI message feedback:', aiMessage.feedback);
      addMessage(aiMessage);
      console.log('[7] Messages after adding AI message:', messages);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[ERROR] Error in handleAudioRecorded:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
      console.log('[8] Loading set to false');
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

