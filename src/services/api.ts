import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class TeacherAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Chat endpoints
  async chatWithAudio(
    audioBlob: Blob,
    sessionId: string,
    speakByAI: number = 1,
    language: string = 'en'
  ): Promise<{ audioBlob: Blob; feedback: any }> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('session_id', sessionId);
    formData.append('speak_by_ai', speakByAI.toString());
    formData.append('language', language);

    const response = await this.api.post('/chat/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    // Extract feedback from response headers
    const feedback = {
      userText: response.headers['x-user-text'] || '',
      correctedText: response.headers['x-corrected-text'] || '',
      aiResponse: response.headers['x-feedback'] || '',
      pronunciationScore: parseFloat(response.headers['x-pronunciation-score'] || '0'),
      accent: response.headers['x-accent'] || '',
      grammarScore: parseFloat(response.headers['x-grammar-score'] || '0'),
    };

    return {
      audioBlob: response.data,
      feedback,
    };
  }

  async chatWithText(
    userText: string,
    sessionId: string,
    speakByAI: number = 1,
    language: string = 'en'
  ): Promise<any> {
    const response = await this.api.post('/chat/text', null, {
      params: {
        user_text: userText,
        session_id: sessionId,
        speak_by_ai: speakByAI,
        language: language,
      },
    });

    return response.data;
  }

  // Session endpoints
  async createSession(
    topic: string,
    level: string = 'intermediate',
    voiceId: number = 1
  ): Promise<any> {
    const response = await this.api.post('/chat/session/create', null, {
      params: {
        topic,
        level,
        voice_id: voiceId,
      },
    });
    return response.data;
  }

  async getSession(sessionId: string): Promise<any> {
    const response = await this.api.get(`/chat/session/${sessionId}`);
    return response.data;
  }

  async deleteSession(sessionId: string): Promise<any> {
    const response = await this.api.delete(`/chat/session/${sessionId}`);
    return response.data;
  }

  // Audio endpoints
  async textToSpeech(
    text: string,
    voiceId: number = 1,
    language: string = 'en'
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('voice_id', voiceId.toString());
    formData.append('language', language);

    const response = await this.api.post('/audio/tts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    return response.data;
  }

  async getAvailableVoices(): Promise<any> {
    const response = await this.api.get('/audio/voices');
    return response.data;
  }

  async getAudioInfo(audioBlob: Blob): Promise<any> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    const response = await this.api.post('/audio/audio-info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const teacherAPI = new TeacherAPI();

