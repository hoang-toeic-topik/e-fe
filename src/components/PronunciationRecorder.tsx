import React, { useRef, useState } from 'react';
import { FiMic, FiSquare, FiPlay, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface PronunciationRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isLoading?: boolean;
}

export const PronunciationRecorder: React.FC<PronunciationRecorderProps> = ({
  onRecordingComplete,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const MAX_RECORDING_TIME = 45; // 45 seconds

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedAudio(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);

        // Auto-stop at 45 seconds
        if (seconds >= MAX_RECORDING_TIME) {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        }
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Clear recording
  const clearRecording = () => {
    setRecordedAudio(null);
    setAudioUrl('');
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

      {/* Recording Button - Large and centered */}
      <div className="flex gap-2 items-center justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isLoading || !!recordedAudio}
            className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
            title={isLoading ? 'Processing...' : recordedAudio ? 'Review your message first' : 'Start Recording'}
          >
            <FiMic size={28} className="sm:w-9 sm:h-9" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg hover:shadow-xl animate-pulse"
            title="Stop Recording"
          >
            <FiSquare size={28} className="sm:w-9 sm:h-9" />
          </button>
        )}
      </div>

      {/* Action buttons when audio is recorded */}
      {recordedAudio && (
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <button
            onClick={playRecording}
            className="flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm"
          >
            <FiPlay size={14} className="sm:w-4 sm:h-4" /> {t('audio.play') || 'Play'}
          </button>
          <button
            onClick={() => onRecordingComplete(recordedAudio)}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 px-4 sm:px-6 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition text-xs sm:text-sm font-medium"
          >
            {isLoading ? '⏳ Processing...' : '✓ Send'}
          </button>
          <button
            onClick={clearRecording}
            className="flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-xs sm:text-sm"
          >
            <FiTrash2 size={14} className="sm:w-4 sm:h-4" /> {t('audio.clear') || 'Clear'}
          </button>
        </div>
      )}
    </div>
  );
};

