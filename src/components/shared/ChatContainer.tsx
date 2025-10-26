import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../store/useChatStore';
import { PronunciationMessage } from '../../store/usePronunciationStore';
import { MessageDisplay } from './MessageDisplay';

// Accept both Message and PronunciationMessage types
type MessageType = Message | PronunciationMessage;

interface ChatContainerProps {
  messages: MessageType[];
  isLoading: boolean;
  children?: React.ReactNode; // For input area
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  children,
}) => {
  console.log('[ChatContainer] Rendering with messages:', messages);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);

  const handlePlayAudio = (message: Message) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (message.audioUrl) {
      audioRef.current = new Audio(message.audioUrl);
      audioRef.current.onplay = () => setPlayingMessageId(message.id);
      audioRef.current.onended = () => setPlayingMessageId(null);
      audioRef.current.play();
    } else if (message.audioBlob) {
      const url = URL.createObjectURL(message.audioBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onplay = () => setPlayingMessageId(message.id);
      audioRef.current.onended = () => setPlayingMessageId(null);
      audioRef.current.play();
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingMessageId(null);
    }
  };

  useEffect(() => {
    // Auto-play AI message audio when new AI message is added
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'ai' && lastMessage.id !== lastMessageIdRef.current && (lastMessage.audioBlob || lastMessage.audioUrl)) {
        lastMessageIdRef.current = lastMessage.id;
        // Delay auto-play slightly to ensure UI is ready
        setTimeout(() => {
          handlePlayAudio(lastMessage);
        }, 500);
      }
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatAreaRef.current) {
      // Scroll to bottom with smooth behavior
      setTimeout(() => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages]);

  return (
    <div className="w-full max-w-2xl h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Area */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto">
        <MessageDisplay
          messages={messages}
          isLoading={isLoading}
          onPlayAudio={handlePlayAudio}
          onStopAudio={handleStopAudio}
          playingMessageId={playingMessageId}
        />
      </div>

      {/* Input Area - Always visible */}
      <div className="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-6 bg-white flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

