import React, { useState } from 'react';
import { useOnboardingStore, LearningGoal } from '../store/useOnboardingStore';

interface OnboardingStep2Props {
  onNext: () => void;
  onBack: () => void;
}

const goalOptions: Array<{
  id: LearningGoal;
  label: string;
  description: string;
}> = [
  {
    id: 'ielts_exam',
    label: 'Pass the IELTS exam',
    description: 'Prepare for IELTS certification',
  },
  {
    id: 'job_interview',
    label: 'Get ready for a job interview',
    description: 'Improve interview skills',
  },
  {
    id: 'test_level',
    label: 'Test my English level',
    description: 'Assess your current level',
  },
  {
    id: 'conversational',
    label: 'Improve my conversational English',
    description: 'Enhance everyday conversations',
  },
  {
    id: 'work_english',
    label: 'Improve my English for work',
    description: 'Professional English skills',
  },
  {
    id: 'english_teacher',
    label: "I'm an English teacher",
    description: 'Teaching resources and tools',
  },
];

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onBack }) => {
  const { learningGoal, setLearningGoal } = useOnboardingStore();
  const [selected, setSelected] = useState<LearningGoal | null>(learningGoal);

  const handleSelect = (goal: LearningGoal) => {
    setSelected(goal);
    setLearningGoal(goal);
  };

  const handleContinue = () => {
    if (selected) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 bg-blue-400 rounded-full" style={{ width: '33%' }}></div>
            <div className="h-1 bg-blue-400 rounded-full" style={{ width: '33%' }}></div>
            <div className="h-1 bg-gray-600 rounded-full flex-1"></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            What is your current goal?
          </h2>
          <p className="text-blue-200">
            We'll personalize SmallTalk2Me based on your goals.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {goalOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full p-4 rounded-xl transition-all duration-200 text-left border-2 ${
                selected === option.id
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-100 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selected === option.id
                      ? 'bg-white border-white'
                      : 'border-gray-500'
                  }`}
                >
                  {selected === option.id && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{option.label}</h3>
                  <p className="text-sm opacity-75">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-lg font-semibold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`flex-1 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
              selected
                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

