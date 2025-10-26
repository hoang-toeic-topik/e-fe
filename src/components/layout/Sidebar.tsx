import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMessageCircle, FiMic } from 'react-icons/fi';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        title="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">English AI Teacher</h2>
          <p className="text-xs text-gray-500 mt-1">Learning Hub</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {/* AI Talk */}
          <button
            onClick={() => handleNavigation('/chat-with-ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive('/chat-with-ai')
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiMessageCircle size={20} />
            <span>AI Talk</span>
          </button>

          {/* Pronunciation Practice */}
          <button
            onClick={() => handleNavigation('/pronunciation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive('/pronunciation')
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiMic size={20} />
            <span>Pronunciation</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

