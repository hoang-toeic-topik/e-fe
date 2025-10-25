import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LearningFocus = 
  | 'speaking_confidence'
  | 'pronunciation'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'writing';

export type LearningGoal =
  | 'ielts_exam'
  | 'job_interview'
  | 'test_level'
  | 'conversational'
  | 'work_english'
  | 'english_teacher';

export interface UserProfile {
  name: string;
  email: string;
  password: string;
}

export interface OnboardingState {
  // Onboarding data
  learningFocus: LearningFocus | null;
  learningGoal: LearningGoal | null;
  userProfile: UserProfile | null;
  isOnboardingComplete: boolean;

  // Actions
  setLearningFocus: (focus: LearningFocus) => void;
  setLearningGoal: (goal: LearningGoal) => void;
  setUserProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      learningFocus: null,
      learningGoal: null,
      userProfile: null,
      isOnboardingComplete: false,

      setLearningFocus: (focus: LearningFocus) => set({ learningFocus: focus }),
      setLearningGoal: (goal: LearningGoal) => set({ learningGoal: goal }),
      setUserProfile: (profile: UserProfile) => set({ userProfile: profile }),
      completeOnboarding: () => set({ isOnboardingComplete: true }),
      resetOnboarding: () =>
        set({
          learningFocus: null,
          learningGoal: null,
          userProfile: null,
          isOnboardingComplete: false,
        }),
    }),
    {
      name: 'onboarding-store',
      partialize: (state) => ({
        learningFocus: state.learningFocus,
        learningGoal: state.learningGoal,
        userProfile: state.userProfile,
        isOnboardingComplete: state.isOnboardingComplete,
      }),
    }
  )
);

