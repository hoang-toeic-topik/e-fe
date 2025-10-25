import { useEffect, useState } from 'react';
import { useChatStore, Message } from './store/useChatStore';
import { useOnboardingStore } from './store/useOnboardingStore';
import { teacherAPI } from './services/api';
import { ChatLayout } from './components/ChatLayout';
import { OnboardingFlow } from './components/OnboardingFlow';
import './i18n';

function App() {
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

  const { isOnboardingComplete } = useOnboardingStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render to ensure store is ready
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Check backend health on mount
    teacherAPI.healthCheck().catch((err) => {
      console.error('Backend not available:', err);
      setError('Backend server is not available');
    });
  }, [setError]);

  // Add initial greeting message only on first load
  useEffect(() => {
    if (isHydrated && isOnboardingComplete && !hasGreeting) {
      const greetingMessage: Message = {
        id: `msg_greeting_${Date.now()}`,
        type: 'ai',
        text: "Hello! 👋 I'm your English AI Teacher. I'm here to help you practice speaking English in a natural and engaging way. Let's start a conversation! What would you like to talk about today?",
        timestamp: new Date(),
      };
      addMessage(greetingMessage);
      setHasGreeting(true);
    }
  }, [isHydrated, isOnboardingComplete, hasGreeting, addMessage, setHasGreeting]);



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

      // Send audio to backend
      const response = await teacherAPI.chatWithAudio(
        audioBlob,
        sessionId,
        voiceId,
        language
      );

      // Update user message with transcribed text
      updateMessage(userMessage.id, {
        text: response.feedback.userText || 'Your message',
      });

      // Create AI response message with audio
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        text: response.feedback.aiResponse,
        timestamp: new Date(),
        audioBlob: response.audioBlob,
        correctedText: response.feedback.correctedText,
        feedback: {
          pronunciation: { score: response.feedback.pronunciationScore },
          accent: { accent: response.feedback.accent },
          grammar: { score: response.feedback.grammarScore },
        },
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

  // Show onboarding if not complete (after hydration)
  if (isHydrated && !isOnboardingComplete) {
    return <OnboardingFlow onComplete={() => {}} />;
  }

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <ChatLayout
        messages={messages}
        isLoading={isLoading}
        onAudioRecorded={handleAudioRecorded}
      />
    </div>
  );
}

export default App;

