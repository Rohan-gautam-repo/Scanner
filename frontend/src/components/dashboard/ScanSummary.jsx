// src/components/dashboard/ScanSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScanSummary = ({ stats = {} }) => {
  const navigate = useNavigate();
  
  // Set default values if not provided
  const {
    totalScans = 24,
    highSeverity = 8,
    mediumSeverity = 15,
    lowSeverity = 12
  } = stats;

  const cards = [
    {
      title: 'Total Scans',
      value: totalScans,
      icon: '📊',
      change: '+12%',
      hasIncrease: true,
      color: 'from-blue-600 to-blue-700',
      iconBg: 'bg-blue-600/20',
    },
    {
      title: 'High Severity',
      value: highSeverity,
      icon: '🚨',
      change: '+5%',
      hasIncrease: true,
      color: 'from-red-600 to-red-700',
      iconBg: 'bg-red-600/20',
    },
    {
      title: 'Medium Severity',
      value: mediumSeverity,
      icon: '⚠️',
      change: '-3%',
      hasIncrease: false,
      color: 'from-amber-600 to-amber-700',
      iconBg: 'bg-amber-600/20',
    },
    {
      title: 'Low Severity',
      value: lowSeverity,
      icon: '✓',
      change: '+8%',
      hasIncrease: true,
      color: 'from-emerald-600 to-emerald-700',
      iconBg: 'bg-emerald-600/20',
    },
  ];
  
  const navigateToScanDetails = () => {
    navigate('/dashboard/scan-details');
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold gradient-text">Security Overview</h2>
        <button
          onClick={navigateToScanDetails}
          className="text-sm text-violet-300 hover:text-violet-200 flex items-center gap-1 transition-colors"
        >
          View Detailed Report
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="glass-card p-6 hover:shadow-xl transition-all duration-300 dashboard-card cursor-pointer group"
            onClick={navigateToScanDetails}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-violet-200 text-sm font-medium">{card.title}</p>
                <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>{card.value}</p>
              </div>
              <div className={`${card.iconBg} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-xl">{card.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`${card.hasIncrease ? 'text-green-400' : 'text-red-400'} flex items-center text-xs font-medium`}>
                <span className="mr-1">{card.hasIncrease ? '↑' : '↓'}</span>
                <span>{card.change}</span>
              </span>
              <span className="text-xs text-zinc-400 ml-2">Since last scan</span>
            </div>
            <div className="w-full h-1 bg-zinc-800/50 mt-4 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.color} rounded-full`} 
                style={{ width: `${Math.min(100, card.value * 3)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanSummary;
