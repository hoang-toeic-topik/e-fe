import React, { useState } from 'react';
import { OnboardingStep1 } from './OnboardingStep1';
import { OnboardingStep2 } from './OnboardingStep2';
import { OnboardingStep3 } from './OnboardingStep3';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <>
      {currentStep === 1 && <OnboardingStep1 onNext={handleNextStep} />}
      {currentStep === 2 && (
        <OnboardingStep2 onNext={handleNextStep} onBack={handlePreviousStep} />
      )}
      {currentStep === 3 && (
        <OnboardingStep3 onComplete={handleComplete} onBack={handlePreviousStep} />
      )}
    </>
  );
};

