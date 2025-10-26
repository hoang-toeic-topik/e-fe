import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useOnboardingStore } from './store/useOnboardingStore';
import { teacherAPI } from './services/api';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ChatWithAI } from './pages/ChatWithAI';
import { PronunciationPracticePage } from './pages/PronunciationPracticePage';
import './i18n';

function App() {
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
    });
  }, []);

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
    <Router>
      <Routes>
        <Route path="/chat-with-ai" element={<ChatWithAI />} />
        <Route path="/pronunciation" element={<PronunciationPracticePage />} />
        <Route path="/" element={<Navigate to="/chat-with-ai" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

