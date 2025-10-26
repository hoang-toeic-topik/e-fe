import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import { useChatStore } from '../store/useChatStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const { voiceId, setVoiceId } = useChatStore();
  const [speed, setSpeed] = useState(1);
  const [level, setLevel] = useState('intermediate');

  // Ensure English is the default language on first load
  React.useEffect(() => {
    if (!i18n.language || i18n.language === 'cimode') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const voices = [
    { id: 1, name: t('voice.american') || 'American' },
    { id: 2, name: t('voice.british') || 'British' },
    { id: 3, name: t('voice.australian') || 'Australian' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ko', name: '한국어' },
  ];

  const levels = [
    { value: 'beginner', label: t('level.beginner') || 'Beginner' },
    { value: 'intermediate', label: t('level.intermediate') || 'Intermediate' },
    { value: 'advanced', label: t('level.advanced') || 'Advanced' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">⚙️ {t('settings.title') || 'Settings'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎤 {t('voice.title') || 'Voice'}
            </label>
            <div className="space-y-2">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setVoiceId(voice.id)}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    voiceId === voice.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {voice.name}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ⚡ {t('settings.speed') || 'Speed'}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">{speed.toFixed(1)}x</span>
            </div>
          </div>

          {/* Learning Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📚 {t('settings.level') || 'Learning Level'}
            </label>
            <div className="space-y-2">
              {levels.map((lv) => (
                <button
                  key={lv.value}
                  onClick={() => setLevel(lv.value)}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    level === lv.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lv.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🌐 {t('language.title') || 'Language'}
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    i18n.language === lang.code
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            {t('common.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

