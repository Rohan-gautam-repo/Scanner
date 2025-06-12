// src/components/dashboard/ScanSummary.jsx
import React from 'react';

const ScanSummary = ({ stats = {} }) => {
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
      color: 'bg-blue-500',
    },
    {
      title: 'High Severity',
      value: highSeverity,
      icon: '🚨',
      color: 'bg-red-500',
    },
    {
      title: 'Medium Severity',
      value: mediumSeverity,
      icon: '⚠️',
      color: 'bg-yellow-500',
    },
    {
      title: 'Low Severity',
      value: lowSeverity,
      icon: '✓',
      color: 'bg-green-500',
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-700"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-400 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold mt-2 text-white">{card.value}</p>
            </div>            <div className={`${card.color} text-white p-3 rounded-xl shadow-lg`}>
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-400 flex items-center text-xs">
              <span className="mr-1">↑</span>
              <span>12%</span>
            </span>
            <span className="text-xs text-zinc-400 ml-2">Since last scan</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScanSummary;
