import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

interface TopicSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
  isLoading?: boolean;
}

const TOPICS = [
  { id: 'daily_life', label: 'Daily Life', emoji: '🏠' },
  { id: 'food', label: 'Food & Cooking', emoji: '🍽️' },
  { id: 'travel', label: 'Travel & Tourism', emoji: '✈️' },
  { id: 'hobbies', label: 'Hobbies & Sports', emoji: '⚽' },
  { id: 'work', label: 'Work & Career', emoji: '💼' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'health', label: 'Health & Fitness', emoji: '💪' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'culture', label: 'Culture & Arts', emoji: '🎨' },
  { id: 'environment', label: 'Environment', emoji: '🌍' },
  { id: 'relationships', label: 'Relationships', emoji: '👥' },
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    onSelectTopic(topicId);
    setSelectedTopic(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{t('topic.select_topic') || 'Select a Topic'}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {t('topic.choose_conversation') || 'Choose a topic to start your conversation'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Topics Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                  selectedTopic === topic.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-3xl mb-2">{topic.emoji}</div>
                <div className="text-sm font-semibold text-gray-800">{topic.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            {t('common.cancel') || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

