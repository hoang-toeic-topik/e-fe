import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

// Custom storage with TTL (1 hour 30 minutes)
const TTL_DURATION = 1.5 * 60 * 60 * 1000; // 1.5 hours in milliseconds

const createStorageWithTTL = (): PersistStorage<any> => {
  return {
    getItem: (name: string) => {
      const item = localStorage.getItem(name);
      if (!item) return null;

      try {
        const parsed = JSON.parse(item);
        const now = Date.now();

        // Check if TTL has expired
        if (parsed.timestamp && now - parsed.timestamp > TTL_DURATION) {
          localStorage.removeItem(name);
          return null;
        }

        return parsed;
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      try {
        const withTimestamp = {
          ...value,
          timestamp: Date.now(),
        };
        localStorage.setItem(name, JSON.stringify(withTimestamp));
      } catch {
        // Silently fail if storage is full
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  };
};

export interface PronunciationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  correctedText?: string;
  timestamp: Date;
  audioBlob?: Blob;
  audioUrl?: string;
  isNewMessage?: boolean; // Track if message is newly received from API
  feedback?: {
    userText?: string;
    correctedText?: string;
    aiResponse?: string;
    pronunciationScore?: number;
    accent?: string;
    grammarScore?: number;
    pronunciationSuggestions?: string[];
    accentSuggestions?: string[];
    grammarErrors?: string[];
    grammar?: any;
    pronunciation?: any;
  };
}

export interface PronunciationState {
  sessionId: string;
  messages: PronunciationMessage[];
  isLoading: boolean;
  error: string | null;
  language: string;
  voiceId: number;
  topic: string | null;
  hasGreeting: boolean;

  // Actions
  setSessionId: (id: string) => void;
  addMessage: (message: PronunciationMessage) => void;
  updateMessage: (id: string, updates: Partial<PronunciationMessage>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLanguage: (lang: string) => void;
  setVoiceId: (id: number) => void;
  setTopic: (topic: string | null) => void;
  setHasGreeting: (has: boolean) => void;
}

export const usePronunciationStore = create<PronunciationState>()(
  persist(
    (set) => ({
      sessionId: `session_${Date.now()}`,
      messages: [],
      isLoading: false,
      error: null,
      language: localStorage.getItem('language') || 'en',
      voiceId: 1,
      topic: null,
      hasGreeting: false,

      setSessionId: (id: string) => set({ sessionId: id }),
      addMessage: (message: PronunciationMessage) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      updateMessage: (id: string, updates: Partial<PronunciationMessage>) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),
      clearMessages: () => set({ messages: [], hasGreeting: false }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setLanguage: (lang: string) => {
        localStorage.setItem('language', lang);
        set({ language: lang });
      },
      setVoiceId: (id: number) => set({ voiceId: id }),
      setTopic: (topic: string | null) => set({ topic }),
      setHasGreeting: (has: boolean) => set({ hasGreeting: has }),
    }),
    {
      name: 'pronunciation-store',
      storage: createStorageWithTTL(),
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
        language: state.language,
        voiceId: state.voiceId,
        topic: state.topic,
        hasGreeting: state.hasGreeting,
      }),
    }
  )
);

