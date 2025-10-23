import React from 'react';
import { useTranslation } from 'react-i18next';

interface VoiceSelectorProps {
  selectedVoice: number;
  onVoiceChange: (voiceId: number) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
}) => {
  const { t } = useTranslation();

  const voices = [
    { id: 1, name: t('voice.american') },
    { id: 2, name: t('voice.british') },
    { id: 3, name: t('voice.australian') },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        {t('voice.title')}
      </label>
      <div className="flex gap-2">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onVoiceChange(voice.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedVoice === voice.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {voice.name}
          </button>
        ))}
      </div>
    </div>
  );
};

