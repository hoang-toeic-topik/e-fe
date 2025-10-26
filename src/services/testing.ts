/**
 * Frontend-Backend Integration Testing
 * Tests all features to ensure FE-BE communication works correctly
 */

import { teacherAPI } from './api';

export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  duration: number;
  error?: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passCount: number;
  failCount: number;
}

class IntegrationTester {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<TestSuite> {
    console.log('🧪 Starting FE-BE Integration Tests...\n');
    this.results = [];

    // Test 1: Health Check
    await this.testHealthCheck();

    // Test 2: Session Creation
    await this.testSessionCreation();

    // Test 3: Text Chat
    await this.testTextChat();

    // Test 4: Audio Processing
    await this.testAudioProcessing();

    // Test 5: TTS
    await this.testTTS();

    // Test 6: Available Voices
    await this.testAvailableVoices();

    // Test 7: Session Retrieval
    await this.testSessionRetrieval();

    // Test 8: Session Deletion
    await this.testSessionDeletion();

    return this.generateReport();
  }

  private async testHealthCheck(): Promise<void> {
    const testName = '1. Health Check';
    this.startTime = Date.now();

    try {
      const response = await teacherAPI.healthCheck();
      const duration = Date.now() - this.startTime;

      if (response && response.status) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: response,
        });
        console.log(`✅ ${testName} - ${duration}ms`);
      } else {
        throw new Error('Invalid health check response');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testSessionCreation(): Promise<void> {
    const testName = '2. Session Creation';
    this.startTime = Date.now();

    try {
      const response = await teacherAPI.createSession('daily_life', 'intermediate', 1);
      const duration = Date.now() - this.startTime;

      if (response && response.session_id) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { sessionId: response.session_id },
        });
        console.log(`✅ ${testName} - ${duration}ms - Session: ${response.session_id}`);
      } else {
        throw new Error('No session ID in response');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testTextChat(): Promise<void> {
    const testName = '3. Text Chat';
    this.startTime = Date.now();

    try {
      const sessionId = `test_session_${Date.now()}`;
      const response = await teacherAPI.chatWithText(
        'Hello, how are you?',
        sessionId,
        1,
        'en'
      );
      const duration = Date.now() - this.startTime;

      if (response && response.response) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { response: response.response.substring(0, 100) },
        });
        console.log(`✅ ${testName} - ${duration}ms`);
      } else {
        throw new Error('No response from text chat');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testAudioProcessing(): Promise<void> {
    const testName = '4. Audio Processing';
    this.startTime = Date.now();

    try {
      // Create a simple audio blob for testing
      const audioData = new Uint8Array(1000);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const sessionId = `test_session_${Date.now()}`;
      const response = await teacherAPI.chatWithAudio(audioBlob, sessionId, 1, 'en');
      const duration = Date.now() - this.startTime;

      if (response && response.audioBlob && response.audioBlob.size > 0) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { audioSize: response.audioBlob.size },
        });
        console.log(`✅ ${testName} - ${duration}ms - Audio size: ${response.audioBlob.size}`);
      } else {
        throw new Error('No audio response');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testTTS(): Promise<void> {
    const testName = '5. Text-to-Speech';
    this.startTime = Date.now();

    try {
      const response = await teacherAPI.textToSpeech('Hello world', 1, 'en');
      const duration = Date.now() - this.startTime;

      if (response && response.size > 0) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { audioSize: response.size },
        });
        console.log(`✅ ${testName} - ${duration}ms - Audio size: ${response.size}`);
      } else {
        throw new Error('No TTS response');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testAvailableVoices(): Promise<void> {
    const testName = '6. Available Voices';
    this.startTime = Date.now();

    try {
      const response = await teacherAPI.getAvailableVoices();
      const duration = Date.now() - this.startTime;

      if (response && Array.isArray(response)) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { voiceCount: response.length },
        });
        console.log(`✅ ${testName} - ${duration}ms - Voices: ${response.length}`);
      } else {
        throw new Error('Invalid voices response');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testSessionRetrieval(): Promise<void> {
    const testName = '7. Session Retrieval';
    this.startTime = Date.now();

    try {
      const sessionId = `test_session_${Date.now()}`;
      const response = await teacherAPI.getSession(sessionId);
      const duration = Date.now() - this.startTime;

      if (response) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { sessionId },
        });
        console.log(`✅ ${testName} - ${duration}ms`);
      } else {
        throw new Error('No session data');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testSessionDeletion(): Promise<void> {
    const testName = '8. Session Deletion';
    this.startTime = Date.now();

    try {
      const sessionId = `test_session_${Date.now()}`;
      const response = await teacherAPI.deleteSession(sessionId);
      const duration = Date.now() - this.startTime;

      if (response) {
        this.results.push({
          name: testName,
          status: 'PASS',
          duration,
          details: { sessionId },
        });
        console.log(`✅ ${testName} - ${duration}ms`);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.log(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private generateReport(): TestSuite {
    const passCount = this.results.filter((r) => r.status === 'PASS').length;
    const failCount = this.results.filter((r) => r.status === 'FAIL').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST REPORT');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${passCount}/${this.results.length}`);
    console.log(`❌ Failed: ${failCount}/${this.results.length}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log('='.repeat(60) + '\n');

    return {
      name: 'FE-BE Integration Tests',
      tests: this.results,
      totalDuration,
      passCount,
      failCount,
    };
  }
}

export const integrationTester = new IntegrationTester();

