// src/components/dashboard/TriggerScanModal.jsx
import React, { useState } from 'react';

const TriggerScanModal = ({ isOpen, onClose, onStartScan }) => {
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!target) return;
    
    setScanning(true);
    
    // Simulated scan progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onStartScan && onStartScan(target);
          setScanning(false);
          setProgress(0);
          setTarget('');
          onClose();
        }, 500);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Start New Scan</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={scanning}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Target Domain or URL
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={scanning}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the full URL of the target website to scan
            </p>
          </div>
          
          {scanning && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Scanning in progress ({progress}%)...
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
              disabled={scanning}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={scanning}
            >
              {scanning ? 'Scanning...' : 'Start Scan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriggerScanModal;
