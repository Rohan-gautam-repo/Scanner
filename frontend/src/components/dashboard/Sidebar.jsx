// src/components/dashboard/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Scan Details', icon: '🔍', path: '/dashboard/scan-details' },
    { name: 'AI Assistant', icon: '🤖', path: '/dashboard/ai-assistant' },
    { name: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className={`${collapsed ? 'w-full flex justify-center' : ''}`}>
          {collapsed ? (
            <span className="text-2xl font-bold text-blue-400">V</span>
          ) : (
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-400 mr-2">V</span>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                VulnScanner
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <div className="py-4">
        <nav>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } transition-colors duration-200 rounded-lg ${
                    collapsed ? 'justify-center' : ''
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <Link
            to="/"
            className={`flex items-center py-2 px-4 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
