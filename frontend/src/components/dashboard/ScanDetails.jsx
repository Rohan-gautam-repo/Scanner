// src/components/dashboard/ScanDetails.jsx
import React, { useState } from 'react';
import ReportExport from './ReportExport';

const ScanDetails = () => {
  const [selectedScan, setSelectedScan] = useState(null);
  
  // Mock scan data - in a real app, this would come from an API
  const scanList = [
    { 
      id: 1, 
      name: 'example.com', 
      date: 'June 10, 2025', 
      issues: 18, 
      severity: 'high',
      vulnerabilities: [
        { type: 'SQL Injection', severity: 'critical', url: '/login', description: 'Unsanitized input allows SQL injection in login form' },
        { type: 'XSS', severity: 'high', url: '/contact', description: 'Stored XSS vulnerability in contact form' },
        { type: 'CSRF', severity: 'medium', url: '/account', description: 'Missing CSRF tokens on account settings form' }
      ]
    },
    { 
      id: 2, 
      name: 'testsite.org', 
      date: 'June 8, 2025', 
      issues: 7, 
      severity: 'medium',
      vulnerabilities: [
        { type: 'Outdated Library', severity: 'medium', component: 'jQuery 2.1.4', description: 'Using outdated library with known vulnerabilities' },
        { type: 'Missing Headers', severity: 'medium', description: 'Missing security headers such as Content-Security-Policy' }
      ]
    },
    { 
      id: 3, 
      name: 'secureapp.net', 
      date: 'June 5, 2025', 
      issues: 3, 
      severity: 'low',
      vulnerabilities: [
        { type: 'Insecure Cookie', severity: 'low', description: 'Cookies missing Secure and HttpOnly flags' },
        { type: 'Information Disclosure', severity: 'low', description: 'Server version exposed in HTTP headers' }
      ]
    }
  ];
  
  const handleSelectScan = (scan) => {
    setSelectedScan(scan);
  };
  
  // Get severity class for styling
  const getSeverityClass = (severity) => {
    switch(severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-900/60 text-red-200 border-red-700/50';
      case 'high':
        return 'bg-red-900/60 text-red-200 border-red-700/50';
      case 'medium':
        return 'bg-amber-800/60 text-amber-200 border-amber-700/50';
      case 'low':
        return 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50';
      default:
        return 'bg-blue-900/60 text-blue-200 border-blue-700/50';
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold gradient-text mb-6">Scan Details</h1>
      
      <div className="glass-card p-6 mb-6">
        <div className="border-b border-violet-500/20 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-violet-200">Recent Scan Results</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-violet-100 mb-4">
            Select a scan from the list below to view detailed results and vulnerability information.
          </p>
          
          <div className="space-y-3 mt-4">
            {scanList.map(scan => (
              <div 
                key={scan.id} 
                className={`p-4 border ${selectedScan?.id === scan.id ? 'border-violet-400' : 'border-violet-500/20'} 
                  rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition cursor-pointer`}
                onClick={() => handleSelectScan(scan)}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-white">{scan.name}</h3>
                    <p className="text-sm text-violet-200/70">{scan.date}</p>
                  </div>
                  <span className={`${getSeverityClass(scan.severity)} text-xs font-medium px-3 py-1 rounded-full self-start border backdrop-blur-sm`}>
                    {scan.issues} Issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedScan && (
        <>
          <div className="glass-card p-6 mb-6 animate-fade-in">
            <div className="border-b border-violet-500/20 pb-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-violet-200">
                  Scan Details for {selectedScan.name}
                </h2>
                <span className={`${getSeverityClass(selectedScan.severity)} text-xs font-medium px-3 py-1 rounded-full border backdrop-blur-sm`}>
                  {selectedScan.severity.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-zinc-900/60 border border-violet-500/20 rounded-lg p-4">
                <h3 className="text-violet-200 font-medium mb-2">Scan Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-violet-300/80">Target:</span>
                    <span className="text-white font-medium">{selectedScan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-violet-300/80">Scan Date:</span>
                    <span className="text-white">{selectedScan.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-violet-300/80">Issues Found:</span>
                    <span className="text-white">{selectedScan.issues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-violet-300/80">Overall Severity:</span>
                    <span className={`font-medium ${
                      selectedScan.severity === 'high' ? 'text-red-400' :
                      selectedScan.severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{selectedScan.severity.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/60 border border-violet-500/20 rounded-lg p-4">
                <h3 className="text-violet-200 font-medium mb-2">Scan Statistics</h3>
                <div className="mt-3">
                  <div className="space-y-4">
                    {/* Severity breakdown visualization */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-violet-300/80">Severity Breakdown</span>
                      </div>
                      <div className="w-full h-4 bg-zinc-800/80 rounded-full overflow-hidden flex">
                        {selectedScan.vulnerabilities.some(v => v.severity === 'critical' || v.severity === 'high') && (
                          <div className="bg-red-600/80 h-full" style={{ width: '40%' }}></div>
                        )}
                        {selectedScan.vulnerabilities.some(v => v.severity === 'medium') && (
                          <div className="bg-amber-600/80 h-full" style={{ width: '30%' }}></div>
                        )}
                        {selectedScan.vulnerabilities.some(v => v.severity === 'low') && (
                          <div className="bg-emerald-600/80 h-full" style={{ width: '30%' }}></div>
                        )}
                      </div>
                      <div className="flex text-xs mt-1 text-violet-200/70 justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-600/80 mr-1"></div>
                          <span>Critical/High</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-600/80 mr-1"></div>
                          <span>Medium</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-600/80 mr-1"></div>
                          <span>Low</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vulnerabilities list */}
            <div className="border-t border-violet-500/20 pt-6">
              <h3 className="text-violet-200 font-medium mb-3">Identified Vulnerabilities</h3>
              <div className="space-y-3 mt-4">
                {selectedScan.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="bg-zinc-900/60 border border-violet-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{vuln.type}</h4>
                      <span className={`${getSeverityClass(vuln.severity)} text-xs font-medium px-2 py-0.5 rounded-full border`}>
                        {vuln.severity}
                      </span>
                    </div>
                    {vuln.url && (
                      <div className="text-sm text-violet-300/80 mb-1">
                        <span className="text-violet-400">URL:</span> {vuln.url}
                      </div>
                    )}
                    {vuln.component && (
                      <div className="text-sm text-violet-300/80 mb-1">
                        <span className="text-violet-400">Component:</span> {vuln.component}
                      </div>
                    )}
                    <p className="text-sm text-violet-200/90 mt-1">{vuln.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Report Export Component */}
          <ReportExport scanName={selectedScan.name} />
        </>
      )}
      
      {!selectedScan && (
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-xl font-medium text-violet-200 mb-2">No Scan Selected</h3>
          <p className="text-violet-300/80 max-w-md">
            Select a scan from the list above to view detailed vulnerability information and export options.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanDetails;
