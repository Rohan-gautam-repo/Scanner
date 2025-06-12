// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ScanSummary from '../components/dashboard/ScanSummary';
import VulnerabilityChart from '../components/dashboard/VulnerabilityChart';
import VulnTable from '../components/dashboard/VulnTable';
import AIReportAssistant from '../components/dashboard/AIReportAssistant';
import ReportExport from '../components/dashboard/ReportExport';
import TriggerScanModal from '../components/dashboard/TriggerScanModal';

const Dashboard = () => {
  const [showScanModal, setShowScanModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleStartScan = (target) => {
    console.log(`Starting scan on: ${target}`);
    // In a real implementation, this would call an API to start the scan
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vulnerability Dashboard</h1>
        <button
          onClick={() => setShowScanModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">🔍</span>
          New Scan
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`inline-block px-4 py-2 rounded-t-lg ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('ai')}
              className={`inline-block px-4 py-2 rounded-t-lg ${
                activeTab === 'ai'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              AI Assistant
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('export')}
              className={`inline-block px-4 py-2 rounded-t-lg ${
                activeTab === 'export'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Export Report
            </button>
          </li>
        </ul>
      </div>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <>
          <ScanSummary />
          <VulnerabilityChart />
          <VulnTable />
        </>
      )}

      {/* AI Assistant */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-0">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Scans</h2>
              <ul className="space-y-2">
                {/*
                  This is a static list for demonstration. In a real application,
                  this data would be fetched from an API or derived from the scan results.
                */}
                {/*
                  Example scan data structure:
                  { date: 'Jun 10, 2025', target: 'example.com', issues: 18 }
                */}
                {/*
                  Map through the scan data and display each scan in the list.
                  Add appropriate keys and values based on the actual data structure.
                */}
                {/*
                  Example:
                  {scanData.map((scan, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="flex justify-between">
                        <span className="font-medium">{scan.target}</span>
                        <span className="text-red-500">{scan.issues} issues</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{scan.date}</div>
                    </li>
                  ))}
                */}
                {/*
                  Example scan data for static display:
                  { [
                      { date: 'Jun 10, 2025', target: 'example.com', issues: 18 },
                      { date: 'Jun 08, 2025', target: 'testsite.org', issues: 7 },
                      { date: 'Jun 05, 2025', target: 'secureapp.net', issues: 3 }
                    ].map((scan, index) => (
                      <li key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <div className="flex justify-between">
                          <span className="font-medium">{scan.target}</span>
                          <span className="text-red-500">{scan.issues} issues</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{scan.date}</div>
                      </li>
                    )) }
                */}
              </ul>
            </div>
            <ScanSummary />
          </div>
          <div className="lg:col-span-2 flex flex-col">
            <AIReportAssistant />
          </div>
        </div>
      )}

      {/* Export Report */}
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

      {/* Scan Modal */}
      <TriggerScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onStartScan={handleStartScan}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
