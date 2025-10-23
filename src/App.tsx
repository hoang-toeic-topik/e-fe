import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore, Message } from './store/useChatStore';
import { teacherAPI } from './services/api';
import { AudioRecorder } from './components/AudioRecorder';
import { ChatBox } from './components/ChatBox';
import { VoiceSelector } from './components/VoiceSelector';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TopicSelector } from './components/TopicSelector';
import { ConversationTab } from './components/ConversationTab';
import { PronunciationPractice } from './components/PronunciationPractice';
import { TestingPanel } from './components/TestingPanel';
import './i18n';

function App() {
  const { t } = useTranslation();
  const {
    sessionId,
    messages,
    isLoading,
    error,
    language,
    voiceId,
    addMessage,
    setLoading,
    setError,
    setVoiceId,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState<'conversation' | 'pronunciation'>('conversation');
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<any>(null);
  const [showTestingPanel, setShowTestingPanel] = useState(false);

  useEffect(() => {
    // Check backend health on mount
    teacherAPI.healthCheck().catch((err) => {
      console.error('Backend not available:', err);
      setError('Backend server is not available');
    });
  }, [setError]);

  const handleSelectTopic = async (topic: string) => {
    setCurrentTopic(topic);
    setShowTopicSelector(false);
    setActiveTab('conversation');
    // Topic will be sent with next audio message
  };

  const handleAudioRecorded = async (audioBlob: Blob) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'user',
        text: 'Recording...',
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Send audio to backend
      const responseBlob = await teacherAPI.chatWithAudio(
        audioBlob,
        sessionId,
        voiceId,
        language
      );

      // Extract feedback from response headers
      const feedback = {
        text: 'AI Feedback received',
        pronunciation: { score: 0.8 },
        accent: { accent: 'american' },
      };

      // Add AI response message
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        text: feedback.text,
        timestamp: new Date(),
        feedback,
      };
      addMessage(aiMessage);

      // Store pronunciation feedback for practice tab
      if (activeTab === 'pronunciation') {
        setPronunciationFeedback(feedback);
      }

      // Play AI response audio
      const audioUrl = URL.createObjectURL(responseBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('app_title')}
          </h1>
          <p className="text-gray-600">{t('app_subtitle')}</p>
          <p className="text-sm text-gray-500 mt-2">
            {t('session.session_id')}: {sessionId}
          </p>
          {/* Testing Button */}
          <button
            onClick={() => setShowTestingPanel(true)}
            className="absolute top-0 right-0 px-3 py-1 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            🧪 Test
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md">
              <button
                onClick={() => setActiveTab('conversation')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'conversation'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💬 {t('tab.conversation') || 'Conversation'}
              </button>
              <button
                onClick={() => setActiveTab('pronunciation')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'pronunciation'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎤 {t('tab.pronunciation') || 'Pronunciation'}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'conversation' ? (
              <ConversationTab
                messages={messages}
                isLoading={isLoading}
                topic={currentTopic || undefined}
                onAudioRecorded={handleAudioRecorded}
              />
            ) : (
              <PronunciationPractice
                onAudioRecorded={handleAudioRecorded}
                isLoading={isLoading}
                feedback={pronunciationFeedback}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Topic Selector Button */}
            <button
              onClick={() => setShowTopicSelector(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              🎯 {currentTopic ? `Topic: ${currentTopic}` : 'Select Topic'}
            </button>

            {/* Voice Selector */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <VoiceSelector
                selectedVoice={voiceId}
                onVoiceChange={setVoiceId}
              />
            </div>

            {/* Language Switcher */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <LanguageSwitcher />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">{t('messages.error')}</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Session Stats */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                {t('feedback.title')}
              </h3>
              <p className="text-sm text-gray-600">
                {messages.length === 0
                  ? t('messages.welcome')
                  : `${messages.length} messages in this session`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Selector Modal */}
      <TopicSelector
        isOpen={showTopicSelector}
        onClose={() => setShowTopicSelector(false)}
        onSelectTopic={handleSelectTopic}
        isLoading={isLoading}
      />

      {/* Testing Panel */}
      <TestingPanel
        isOpen={showTestingPanel}
        onClose={() => setShowTestingPanel(false)}
      />
    </div>
  );
}

export default App;

