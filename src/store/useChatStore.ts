import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  correctedText?: string;
  timestamp: Date;
  feedback?: {
    grammar?: any;
    pronunciation?: any;
    accent?: any;
  };
}

export interface ChatState {
  sessionId: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  language: string;
  voiceId: number;
  topic: string | null;

  // Actions
  setSessionId: (id: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLanguage: (lang: string) => void;
  setVoiceId: (id: number) => void;
  setTopic: (topic: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: `session_${Date.now()}`,
      messages: [],
      isLoading: false,
      error: null,
      language: localStorage.getItem('language') || 'en',
      voiceId: 1,
      topic: null,

      setSessionId: (id: string) => set({ sessionId: id }),
      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setLanguage: (lang: string) => {
        localStorage.setItem('language', lang);
        set({ language: lang });
      },
      setVoiceId: (id: number) => set({ voiceId: id }),
      setTopic: (topic: string | null) => set({ topic }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
        language: state.language,
        voiceId: state.voiceId,
        topic: state.topic,
      }),
    }
  )
);

