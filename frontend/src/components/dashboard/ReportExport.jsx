// src/components/dashboard/ReportExport.jsx
import React, { useState } from 'react';

const ReportExport = ({ scanName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState('');
  const [exportComplete, setExportComplete] = useState(false);

  const simulateExport = (type) => {
    setIsExporting(true);
    setExportType(type);
    setExportProgress(0);
    setExportComplete(false);
    
    // Simulate export process with progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExportComplete(true);
            setTimeout(() => {
              setIsExporting(false);
              setExportComplete(false);
            }, 2000);
          }, 500);
          return 100;
        }
        return prev + 5; // Slower progress for better animation
      });
    }, 150);
  };

  const handleExportPDF = () => {
    // In a real implementation, this would use jsPDF and html2canvas
    simulateExport('PDF');
  };

  const handleExportHTML = () => {
    // In a real implementation, this would generate an HTML report
    simulateExport('HTML');
  };
  
  const handleExportJSON = () => {
    // In a real implementation, this would generate a JSON report
    simulateExport('JSON');
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="border-b border-violet-500/20 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-violet-200">
          Export Report {scanName && `for ${scanName}`}
        </h2>
      </div>
      
      {isExporting ? (
        <div className="flex flex-col items-center justify-center py-8">
          {exportComplete ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl animate-scale-up">
                ✓
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Export Complete!</h3>
              <p className="text-violet-200/80 mb-4">Your {exportType} report has been generated successfully</p>
              <button 
                onClick={() => setIsExporting(false)}
                className="text-sm text-violet-300 hover:text-violet-200 transition"
              >
                Return to export options
              </button>
            </div>
          ) : (
            <>
              <div className="w-full max-w-md mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-violet-200 text-sm">Generating {exportType} report...</span>
                  <span className="text-violet-200 text-sm">{exportProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800/80 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-violet-300/80 text-sm mb-2">
                {exportProgress < 30 ? 'Compiling scan data...' : 
                exportProgress < 60 ? 'Generating report visuals...' : 
                exportProgress < 90 ? 'Formatting document...' :
                'Finalizing export...'}
              </p>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-violet-600/80 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-violet-600/80 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-violet-600/80 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="text-xl">📄</span>
              <span className="font-medium">PDF Report</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
            </button>
            
            <button
              onClick={handleExportHTML}
              className="flex items-center justify-center gap-3 bg-zinc-800/80 border border-violet-500/20 text-white p-4 rounded-xl hover:bg-zinc-700/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <span className="text-xl">🌐</span>
              <span className="font-medium">HTML Report</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
            </button>
            
            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-3 bg-zinc-800/80 border border-violet-500/20 text-white p-4 rounded-xl hover:bg-zinc-700/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <span className="text-xl">🔄</span>
              <span className="font-medium">Raw JSON</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
            </button>
          </div>
          
          <div className="mb-6 bg-zinc-900/50 border border-violet-500/20 rounded-lg p-4">
            <h3 className="text-violet-200 font-medium mb-3">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-violet-100/80">
              <div className="flex">
                <input 
                  type="checkbox" 
                  id="include-full" 
                  className="mr-2 accent-violet-500" 
                  defaultChecked={true}
                />
                <label htmlFor="include-full">Include full scan details</label>
              </div>
              <div className="flex">
                <input 
                  type="checkbox" 
                  id="include-recommendations" 
                  className="mr-2 accent-violet-500" 
                  defaultChecked={true}
                />
                <label htmlFor="include-recommendations">Include fix recommendations</label>
              </div>
              <div className="flex">
                <input 
                  type="checkbox" 
                  id="include-visuals" 
                  className="mr-2 accent-violet-500" 
                  defaultChecked={true}
                />
                <label htmlFor="include-visuals">Include visual charts</label>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-violet-500/20 text-violet-100 p-4 rounded-lg flex items-start">
            <span className="text-lg mr-3 text-violet-300 mt-0.5">💡</span>
            <div className="text-sm">
              <p className="mb-2">
                Reports include all scan details, vulnerabilities found, and recommended fixes. Choose the format that best suits your needs:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-violet-200 font-medium">PDF:</span> Professional format, ideal for sharing with stakeholders</li>
                <li><span className="text-violet-200 font-medium">HTML:</span> Interactive format with additional filtering capabilities</li>
                <li><span className="text-violet-200 font-medium">JSON:</span> Raw data format for integration with other security tools</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportExport;
