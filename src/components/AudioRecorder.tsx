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
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_TIME = 45; // 45 seconds

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start recording timer
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);

        // Auto-stop at 45 seconds
        if (seconds >= MAX_RECORDING_TIME) {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
          }
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        }
      }, 1000);
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
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
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
    <div className="flex flex-col gap-3 sm:gap-4 items-center w-full">
      {/* Recording Timer */}
      {isRecording && (
        <div className={`text-xs sm:text-sm font-semibold ${recordingTime >= 40 ? 'text-red-600' : 'text-gray-600'}`}>
          ⏱️ {recordingTime}s / {MAX_RECORDING_TIME}s
          {recordingTime >= 40 && <span className="ml-2 animate-pulse">⚠️ Time limit approaching</span>}
        </div>
      )}

      {/* Recording Button - Large and centered at bottom */}
      <div className="flex gap-2 items-center justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isLoading || !!audioBlob}
            className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
            title={isLoading ? 'Processing...' : audioBlob ? 'Review your message first' : (t('audio.record_start') || 'Start Recording')}
          >
            <FiMic size={28} className="sm:w-9 sm:h-9" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg hover:shadow-xl animate-pulse"
            title={t('audio.record_stop') || 'Stop Recording'}
          >
            <FiSquare size={28} className="sm:w-9 sm:h-9" />
          </button>
        )}
      </div>

      {/* Action buttons when audio is recorded */}
      {audioBlob && (
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <button
            onClick={playAudio}
            className="flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm"
          >
            <FiPlay size={14} className="sm:w-4 sm:h-4" /> {t('audio.play') || 'Play'}
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 px-4 sm:px-6 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition text-xs sm:text-sm font-medium"
          >
            {isLoading ? '⏳ Processing...' : '✓ Send'}
          </button>
          <button
            onClick={downloadAudio}
            className="flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-xs sm:text-sm"
          >
            <FiDownload size={14} className="sm:w-4 sm:h-4" /> {t('audio.download') || 'Download'}
          </button>
        </div>
      )}
    </div>
  );
};

