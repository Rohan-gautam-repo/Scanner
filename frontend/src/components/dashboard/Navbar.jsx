// src/components/dashboard/Navbar.jsx
import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Scan Details', path: '/dashboard/scan-details' },
    { name: 'AI Assistant', path: '/dashboard/ai-assistant' },
    { name: 'Settings', path: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-zinc-950 border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">              <span className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-violet-500 bg-clip-text text-transparent mr-2 text-shadow">V</span>
              <span className="text-lg font-semibold bg-gradient-to-r from-violet-300 to-violet-500 bg-clip-text text-transparent text-shadow">
                VulnScanner
              </span>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    location.pathname === item.path || 
                    (item.path === '/dashboard' && location.pathname === '/dashboard')
                      ? 'bg-violet-600 text-white font-bold'
                      : 'text-violet-100 hover:bg-zinc-800 hover:text-white'
                  } transition-colors duration-200`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-4">              <span className="text-sm font-medium text-violet-100">
                {user?.email || 'User'}
              </span>
              <div 
                className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold shadow-lg cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <div className="md:hidden">
        <div className="flex flex-wrap justify-center px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 m-1 rounded-md text-sm font-medium flex items-center ${
                location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/dashboard')
                  ? 'bg-violet-600 text-white font-bold'
                  : 'text-violet-100 hover:bg-zinc-800 hover:text-white'
              } transition-colors duration-200`}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
