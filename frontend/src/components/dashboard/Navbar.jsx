// src/components/dashboard/Navbar.jsx
import React from 'react';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md h-16">
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vulnerability Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {user?.email || 'User'}
          </span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
