// src/components/dashboard/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  
  // Function to handle navigation from any component
  const handleNavigation = (path) => {
    navigate(path);
  };
    return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigation} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-900">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
