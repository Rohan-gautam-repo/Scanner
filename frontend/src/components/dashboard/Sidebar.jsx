// src/components/dashboard/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Scan Details', icon: '🔍', path: '/dashboard/scan-details' },
    { name: 'AI Assistant', icon: '🤖', path: '/dashboard/ai-assistant' },
    { name: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
  ];
  return (
    <div className={`bg-zinc-950 text-white transition-all duration-300 ease-in-out flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
        <div className={`${collapsed ? 'w-full flex justify-center' : ''}`}>
          {collapsed ? (
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">V</span>
          ) : (
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent mr-2">V</span>
              <span className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                VulnScanner
              </span>
            </div>
          )}
        </div>        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white"
        >
          {collapsed ? '...' : '...'}
        </button>
      </div>      <div className="py-4 flex-1 flex flex-col">
        <nav className="flex-1">
          <ul className="space-y-2 px-3">
            {navigationItems.map((item) => (
              <li key={item.name}>                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 ${
                    location.pathname === item.path || 
                    (item.path === '/dashboard' && location.pathname === '/dashboard')
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
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
