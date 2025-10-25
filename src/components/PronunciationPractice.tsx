import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMic, FiSquare, FiPlay, FiRotateCcw } from 'react-icons/fi';

interface PronunciationPracticeProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  isLoading?: boolean;
  feedback?: {
    pronunciation_score?: number;
    accent?: string;
    feedback?: string;
  };
}

const PRACTICE_PHRASES = [
  'How are you today?',
  'What is your name?',
  'I like to read books',
  'The weather is beautiful',
  'Can you help me please?',
  'Where is the nearest station?',
  'I would like a cup of coffee',
  'Thank you very much',
  'Nice to meet you',
  'See you tomorrow',
];

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  onAudioRecorded,
  isLoading = false,
  feedback,
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState(PRACTICE_PHRASES[0]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onAudioRecorded(audioBlob);
      setAudioBlob(null);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const nextPhrase = () => {
    const nextIndex = (phraseIndex + 1) % PRACTICE_PHRASES.length;
    setPhraseIndex(nextIndex);
    setSelectedPhrase(PRACTICE_PHRASES[nextIndex]);
    setAudioBlob(null);
  };

  const resetPhrase = () => {
    setAudioBlob(null);
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Phrase Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <p className="text-sm text-gray-600 mb-2">{t('pronunciation.practice_phrase') || 'Practice this phrase:'}</p>
        <p className="text-3xl font-bold text-blue-600 text-center">{selectedPhrase}</p>
        <button
          onClick={nextPhrase}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {t('pronunciation.next_phrase') || 'Next Phrase'}
        </button>
      </div>

      {/* Recording Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
            >
              <FiMic /> {t('audio.record_start') || 'Start Recording'}
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <FiSquare /> {t('audio.record_stop') || 'Stop Recording'}
            </button>
          )}
        </div>



        {audioBlob && (
          <div className="flex gap-2">
            <button
              onClick={playAudio}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FiPlay /> {t('audio.play') || 'Play'}
            </button>
            <button
              onClick={resetPhrase}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <FiRotateCcw /> {t('audio.retry') || 'Retry'}
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition"
            >
              {isLoading ? 'Analyzing...' : 'Submit'}
            </button>
          </div>
        )}
      </div>

      {/* Feedback Display */}
      {feedback && (
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 space-y-3">
          <h3 className="font-bold text-green-800">{t('pronunciation.feedback') || 'Feedback'}</h3>
          
          {feedback.pronunciation_score !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-gray-700">🎤 {t('feedback.pronunciation') || 'Pronunciation'}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(feedback.pronunciation_score || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-green-600">{((feedback.pronunciation_score || 0) * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}

          {feedback.accent && (
            <div className="flex items-center justify-between">
              <span className="text-gray-700">🌍 {t('feedback.accent') || 'Accent'}</span>
              <span className="font-semibold text-gray-800">{feedback.accent}</span>
            </div>
          )}

          {feedback.feedback && (
            <div className="mt-4 p-3 bg-white rounded border border-green-200">
              <p className="text-sm text-gray-700">{feedback.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

