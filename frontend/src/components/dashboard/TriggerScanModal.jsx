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
  };  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold gradient-text">Start Your Free Trial</h2>
          <button 
            onClick={onClose}
            className="text-violet-400 hover:text-white transition-colors"
            disabled={scanning}
          >
            ✕
          </button>
        </div>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Target Domain or URL
            </label>            <input
              type="text"
              placeholder="https://example.com"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-3 bg-zinc-900/50 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 text-white"
              disabled={scanning}
              required
            />
            <p className="text-xs text-violet-300/70 mt-1">
              Enter the full URL of the target website to scan
            </p>
          </div>
            {scanning && (
            <div className="mb-4">
              <div className="w-full bg-zinc-800/80 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-violet-300 mt-1 text-center">
                Scanning in progress ({progress}%)...
              </p>
            </div>
          )}            <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-300 border border-violet-500/20 rounded-lg mr-2 hover:bg-zinc-800/50 transition-all"
              disabled={scanning}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-violet-600/20"
              disabled={scanning}
            >
              {scanning ? 'Scanning...' : 'Start Free Trial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriggerScanModal;
