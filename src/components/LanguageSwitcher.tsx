import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '../store/useChatStore';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { setLanguage } = useChatStore();

  const languages = [
    { code: 'en', name: t('language.english') },
    { code: 'vi', name: t('language.vietnamese') },
    { code: 'ko', name: t('language.korean') },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        {t('language.title')}
      </label>
      <div className="flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              i18n.language === lang.code
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};
