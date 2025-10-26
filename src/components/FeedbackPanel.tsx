import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface FeedbackData {
  userText?: string;
  correctedText?: string;
  aiResponse?: string;
  pronunciationScore?: number;
  accent?: string;
  grammarScore?: number;
  grammarErrors?: string[];
}

interface FeedbackPanelProps {
  feedback: FeedbackData;
  isExpanded: boolean;
  onToggle: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedback,
  isExpanded,
  onToggle,
}) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    pronunciation: true,
    grammar: true,
    suggestions: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const ScoreBar = ({ score, max = 100 }: { score: number; max?: number }) => {
    const percentage = (score / max) * 100;
    const color =
      percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className={`${color} h-full transition-all`} style={{ width: `${percentage}%` }} />
        </div>
        <span className="text-xs font-semibold min-w-10">{score.toFixed(1)}</span>
      </div>
    );
  };

  const Section = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition"
      >
        <h4 className="font-semibold text-xs text-gray-800">{title}</h4>
        {expandedSections[sectionKey] ? (
          <FiChevronUp size={14} />
        ) : (
          <FiChevronDown size={14} />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-2 pb-2 bg-gray-50 space-y-1 text-xs">{children}</div>
      )}
    </div>
  );

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-lg p-3 space-y-3 text-xs">
      {/* Pronunciation Score */}
      {feedback.pronunciationScore !== undefined && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">1️⃣ Pronunciation: {feedback.pronunciationScore.toFixed(0)}/100</p>
          <ScoreBar score={feedback.pronunciationScore} max={100} />
        </div>
      )}

      {/* Accent */}
      {feedback.accent && feedback.accent !== 'unknown' && (
        <div>
          <p className="font-semibold text-gray-700">2️⃣ Accent: <span className="text-purple-600">{feedback.accent}</span></p>
        </div>
      )}

      {/* Grammar Score */}
      {feedback.grammarScore !== undefined && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">3️⃣ Grammar: {feedback.grammarScore}/100</p>
          <ScoreBar score={feedback.grammarScore} max={100} />
        </div>
      )}

      {/* Grammar Errors */}
      {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">4️⃣ Errors to Fix:</p>
          <ul className="space-y-1 ml-2">
            {feedback.grammarErrors.map((error, idx) => (
              <li key={idx} className="text-red-600">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrected Text */}
      {feedback.correctedText && feedback.correctedText !== feedback.userText && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">5️⃣ Corrected:</p>
          <p className="bg-green-50 p-2 rounded text-gray-700 italic">"{feedback.correctedText}"</p>
        </div>
      )}
    </div>
  );
};

