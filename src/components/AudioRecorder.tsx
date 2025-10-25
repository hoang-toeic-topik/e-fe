import React, { useState, useRef } from 'react';
import { FiMic, FiSquare, FiPlay, FiDownload } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
  isLoading?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioRecorded,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording_${Date.now()}.wav`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 transition shadow-lg hover:shadow-xl"
            title={t('audio.record_start') || 'Start Recording'}
          >
            <FiMic size={28} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg hover:shadow-xl animate-pulse"
            title={t('audio.record_stop') || 'Stop Recording'}
          >
            <FiSquare size={28} />
          </button>
        )}
      </div>

      {audioBlob && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={playAudio}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
          >
            <FiPlay size={16} /> {t('audio.play') || 'Play'}
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition text-sm"
          >
            {isLoading ? '⏳ Processing...' : '✓ Send'}
          </button>
        </div>
      )}
    </div>
  );
};

