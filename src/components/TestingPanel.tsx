import React, { useState } from 'react';
import { FiPlay, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { integrationTester, TestSuite } from '../services/testing';

interface TestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestingPanel: React.FC<TestingPanelProps> = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const results = await integrationTester.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadReport = () => {
    if (!testResults) return;

    const report = JSON.stringify(testResults, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${Date.now()}.json`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🧪 FE-BE Integration Tests</h2>
            <p className="text-purple-100 text-sm mt-1">Test all features to ensure frontend-backend communication</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!testResults ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Click the button below to run all integration tests</p>
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition w-full"
              >
                <FiPlay /> {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{testResults.passCount}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{testResults.failCount}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-blue-600">{testResults.totalDuration}ms</p>
                </div>
              </div>

              {/* Test Results */}
              <div className="space-y-2">
                {testResults.tests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      test.status === 'PASS'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {test.status === 'PASS' ? '✅' : '❌'}
                        </span>
                        <span className="font-semibold text-gray-800">{test.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{test.duration}ms</span>
                    </div>
                    {test.error && (
                      <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                    )}
                    {test.details && (
                      <p className="text-sm text-gray-600 mt-1">
                        {JSON.stringify(test.details).substring(0, 100)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleRunTests}
                  disabled={isRunning}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition"
                >
                  <FiRefreshCw /> Run Again
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <FiDownload /> Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

