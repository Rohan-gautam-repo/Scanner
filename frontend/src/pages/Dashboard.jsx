// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const currentPath = location.pathname;

  const handleStartScan = (target) => {
    console.log(`Starting scan on: ${target}`);
    // In a real implementation, this would call an API to start the scan
  };

  return (
    <DashboardLayout>      {currentPath === '/dashboard' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Vulnerability Dashboard</h1>
            <button
              onClick={() => setShowScanModal(true)}
              className="bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center hover:bg-violet-700 transition-colors"
            >
              <span className="mr-2">🔍</span>
              New Scan
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-zinc-800">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-block px-4 py-2 rounded-t-lg ${
                    activeTab === 'dashboard'
                      ? 'text-violet-400 border-b-2 border-violet-400'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`inline-block px-4 py-2 rounded-t-lg ${
                    activeTab === 'export'
                      ? 'text-violet-400 border-b-2 border-violet-400'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Export Report
                </button>
              </li>
            </ul>
          </div>          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <>
              <ScanSummary />
              <VulnerabilityChart />
              <VulnTable />
            </>
          )}          {/* Export Report */}
          {activeTab === 'export' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ScanSummary />
              </div>
              <div className="md:col-span-2">
                <ReportExport />
              </div>
            </div>
          )}
        </>
      )}

      {/* Scan Details Route */}
      {currentPath === '/dashboard/scan-details' && <ScanDetails />}
        {/* AI Assistant Route */}
      {currentPath === '/dashboard/ai-assistant' && <AIAssistant />}
      
      {/* Settings Route */}
      {currentPath === '/dashboard/settings' && <Settings />}      {/* Scan Modal - available on all routes */}
      <TriggerScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onStartScan={handleStartScan}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
