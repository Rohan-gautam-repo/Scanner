// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ScanSummary from '../components/dashboard/ScanSummary';
import VulnerabilityChart from '../components/dashboard/VulnerabilityChart';
import VulnTable from '../components/dashboard/VulnTable';
import AIAssistant from '../components/dashboard/AIAssistant';
import ReportExport from '../components/dashboard/ReportExport';
import TriggerScanModal from '../components/dashboard/TriggerScanModal';
import ScanDetails from '../components/dashboard/ScanDetails';
import Settings from '../components/dashboard/Settings';

const Dashboard = () => {
  const [showScanModal, setShowScanModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleStartScan = (target) => {
    console.log(`Starting scan on: ${target}`);
    // In a real implementation, this would call an API to start the scan
  };
  
  const navigateToScanDetails = () => {
    navigate('/dashboard/scan-details');
  };

  return (
    <DashboardLayout>
      {currentPath === '/dashboard' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Vulnerability Dashboard
            </h1>
            <div className="flex gap-3">
              <button
                onClick={navigateToScanDetails}
                className="bg-zinc-800/80 border border-violet-500/20 text-white px-5 py-2.5 rounded-full flex items-center hover:bg-zinc-700/80 transition-all shadow hover:shadow-violet-600/10"
              >
                View All Scans
              </button>
              <button
                onClick={() => setShowScanModal(true)}
                className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-5 py-2.5 rounded-full flex items-center hover:opacity-90 transition-colors shadow-lg shadow-violet-600/20"
              >
                Start New Scan
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <>
            <ScanSummary />
            <VulnerabilityChart />
            <VulnTable />
          </>
        </>
      )}

      {/* Scan Details Route */}
      {currentPath === '/dashboard/scan-details' && <ScanDetails />}
      
      {/* AI Assistant Route */}
      {currentPath === '/dashboard/ai-assistant' && <AIAssistant />}
      
      {/* Settings Route */}
      {currentPath === '/dashboard/settings' && <Settings />}
      
      {/* Scan Modal - available on all routes */}
      <TriggerScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onStartScan={handleStartScan}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
