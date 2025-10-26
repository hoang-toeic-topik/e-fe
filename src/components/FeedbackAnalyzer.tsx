import React, { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FeedbackData {
  userText?: string;
  correctedText?: string;
  aiResponse?: string;
  pronunciationScore?: number;
  accent?: string;
  grammarScore?: number;
  grammarErrors?: string[];
}

interface FeedbackAnalyzerProps {
  feedback: FeedbackData;
  onClose: () => void;
}

export const FeedbackAnalyzer: React.FC<FeedbackAnalyzerProps> = ({
  feedback,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    transcription: true,
    pronunciation: true,
    grammar: true,
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
        <span className="text-sm font-semibold min-w-12">{score.toFixed(1)}</span>
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
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition"
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {expandedSections[sectionKey] ? (
          <FiChevronUp size={18} />
        ) : (
          <FiChevronDown size={18} />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-3 pb-3 bg-gray-50 space-y-2">{children}</div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">📊 Detailed Feedback Analysis</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Transcription Section */}
          <Section title="📝 Transcription" sectionKey="transcription">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Your Speech:</p>
                <p className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                  {feedback.userText || 'N/A'}
                </p>
              </div>
              {feedback.correctedText && feedback.correctedText !== feedback.userText && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Corrected Text:</p>
                  <p className="text-sm bg-green-50 p-2 rounded border-l-4 border-green-500">
                    {feedback.correctedText}
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* Pronunciation Section */}
          <Section title="🎤 Pronunciation Analysis" sectionKey="pronunciation">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2">Pronunciation Score:</p>
                <ScoreBar score={feedback.pronunciationScore || 0} max={100} />
              </div>
              {feedback.accent && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Detected Accent:</p>
                  <p className="text-sm bg-purple-50 p-2 rounded">
                    <span className="font-semibold">{feedback.accent}</span>
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* Grammar Section */}
          <Section title="✏️ Grammar Analysis" sectionKey="grammar">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2">Grammar Score:</p>
                <ScoreBar score={feedback.grammarScore || 0} max={100} />
              </div>
              {feedback.grammarErrors && feedback.grammarErrors.length > 0 ? (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Errors Found:</p>
                  <ul className="space-y-1">
                    {feedback.grammarErrors.map((error, idx) => (
                      <li key={idx} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-500">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-green-600 font-semibold">✓ No grammar errors found!</p>
              )}
            </div>
          </Section>



          {/* AI Response Section */}
          {feedback.aiResponse && (
            <Section title="🤖 AI Teacher Response" sectionKey="aiResponse">
              <p className="text-sm text-gray-700 leading-relaxed">{feedback.aiResponse}</p>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

