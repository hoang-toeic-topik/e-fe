import React, { useEffect, useState } from 'react';
import { useChatStore, Message } from '../store/useChatStore';
import { teacherAPI } from '../services/api';
import { ChatLayout } from '../components/ChatLayout';

export const ChatWithAI: React.FC = () => {
  const {
    sessionId,
    messages,
    isLoading,
    language,
    voiceId,
    hasGreeting,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    setHasGreeting,
  } = useChatStore();

  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Add initial greeting message only on first load
  useEffect(() => {
    // Only run once when component is hydrated and no greeting has been shown
    if (isHydrated && messages.length === 0 && !hasGreeting) {
      const greetingMessage: Message = {
        id: `msg_greeting_${Date.now()}`,
        type: 'ai',
        text: "Hello! 👋 I'm your English AI Teacher. Let's have a natural conversation to practice your English. What would you like to talk about today?",
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
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'user',
        text: 'Processing audio...',
        timestamp: new Date(),
        audioBlob: audioBlob,
      };
      addMessage(userMessage);

      // Send audio to backend using talkWithAI endpoint
      const response = await teacherAPI.talkWithAI(
        audioBlob,
        sessionId,
        voiceId,
        language
      );

      // Update user message with transcribed text
      updateMessage(userMessage.id, {
        text: response.response.userText || 'Your message',
      });

      // Create AI response message with audio
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        text: response.response.aiResponse,
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
    <ChatLayout
      messages={messages}
      isLoading={isLoading}
      onAudioRecorded={handleAudioRecorded}
      title="AI Talk"
      subtitle="Have a natural conversation with your AI teacher"
    />
  );
};

