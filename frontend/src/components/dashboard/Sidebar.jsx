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
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className={`${collapsed ? 'w-full flex justify-center' : ''}`}>
          {collapsed ? (
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">V</span>
          ) : (
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mr-2">V</span>
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
          {collapsed ? '...' : '...'}
        </button>
      </div>

      <div className="py-4 flex-1 flex flex-col">
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 ${
                    location.pathname === item.path || 
                    (item.path === '/dashboard' && location.pathname.startsWith('/dashboard') && location.pathname === '/dashboard')
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
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
      </div>
    </div>
  );
};

export default Sidebar;
