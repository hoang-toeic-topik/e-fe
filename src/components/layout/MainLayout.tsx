import React, { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { Sidebar } from './Sidebar';
import { SettingsModal } from '../SettingsModal';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'English AI Teacher',
  subtitle = 'Your personal English learning companion',
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between bg-white shadow-sm pt-14 sm:pt-4 lg:pt-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-4">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              title="Settings"
            >
              <FiSettings size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-4 bg-gradient-to-br from-gray-50 to-gray-100">
          {children}
        </div>

        {/* Settings Modal */}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </div>
  );
};

