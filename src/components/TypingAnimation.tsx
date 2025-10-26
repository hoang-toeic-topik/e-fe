import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text = '',
  speed = 30,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Ensure text is a string
  const safeText = text || '';

  useEffect(() => {
    if (displayedText.length < safeText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(safeText.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else if (displayedText.length === safeText.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, safeText, speed, isComplete, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">▌</span>}
    </span>
  );
};

