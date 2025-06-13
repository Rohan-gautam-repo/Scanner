// src/components/dashboard/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  
  // Function to handle navigation from any component
  const handleNavigation = (path) => {
    navigate(path);
  };    return (
    <div className="flex flex-col h-screen bg-[#0B0B0F] relative">
      {/* Gradient background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-700/10 rounded-full filter blur-3xl"></div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative z-10">
        <Navbar onNavigate={handleNavigation} />
        <main className="p-6 container mx-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
