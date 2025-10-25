import React, { useState } from 'react';
import { useOnboardingStore, LearningFocus } from '../store/useOnboardingStore';

interface OnboardingStep1Props {
  onNext: () => void;
}

const focusOptions: Array<{
  id: LearningFocus;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: 'speaking_confidence',
    label: 'Speaking with confidence',
    icon: '🗣️',
    description: 'Improve your speaking skills',
  },
  {
    id: 'pronunciation',
    label: 'Improving pronunciation',
    icon: '🎤',
    description: 'Perfect your pronunciation',
  },
  {
    id: 'vocabulary',
    label: 'Expanding vocabulary',
    icon: '💪',
    description: 'Learn new words and phrases',
  },
  {
    id: 'grammar',
    label: 'Using grammar correctly',
    icon: '📝',
    description: 'Master English grammar',
  },
  {
    id: 'listening',
    label: 'Understanding native speakers',
    icon: '👂',
    description: 'Improve listening comprehension',
  },
  {
    id: 'writing',
    label: 'Writing more fluently',
    icon: '📄',
    description: 'Enhance your writing skills',
  },
];

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext }) => {
  const { learningFocus, setLearningFocus } = useOnboardingStore();
  const [selected, setSelected] = useState<LearningFocus | null>(learningFocus);

  const handleSelect = (focus: LearningFocus) => {
    setSelected(focus);
    setLearningFocus(focus);
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
            <div className="h-1 bg-gray-600 rounded-full flex-1"></div>
            <div className="h-1 bg-gray-600 rounded-full flex-1"></div>
          </div>
        </div>

        {/* Header with Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl">
            👩‍🏫
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              What part of your English do you want to improve the most?
            </h2>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {focusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`p-6 rounded-2xl transition-all duration-200 text-left ${
                selected === option.id
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{option.label}</h3>
                  <p className="text-sm opacity-75">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
            selected
              ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

