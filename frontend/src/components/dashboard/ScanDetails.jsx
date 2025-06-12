// src/components/dashboard/ScanDetails.jsx
import React from 'react';

const ScanDetails = () => {  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Scan Details</h1>
      <div className="bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-700">
        <div className="border-b border-zinc-700 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Scan Results</h2>
        </div>

        <div className="mb-6">
          <p className="text-zinc-400 mb-4">
            Select a scan from the list below to view detailed results and vulnerability information.
          </p>
            {/* Placeholder for scan list */}
          <div className="space-y-3 mt-4">
            <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-900 hover:bg-zinc-850 transition cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-white">example.com</h3>
                  <p className="text-sm text-zinc-500">June 10, 2025</p>
                </div>
                <span className="bg-red-900 text-red-200 text-xs font-medium px-3 py-1 rounded-full self-start border border-red-700">
                  18 Issues
                </span>
              </div>
            </div>
            
            <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-900 hover:bg-zinc-850 transition cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-white">testsite.org</h3>
                  <p className="text-sm text-zinc-500">June 8, 2025</p>
                </div>
                <span className="bg-yellow-900 text-yellow-200 text-xs font-medium px-3 py-1 rounded-full self-start border border-yellow-700">
                  7 Issues
                </span>
              </div>
            </div>
            
            <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-900 hover:bg-zinc-850 transition cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-white">secureapp.net</h3>
                  <p className="text-sm text-zinc-500">June 5, 2025</p>
                </div>
                <span className="bg-green-900 text-green-200 text-xs font-medium px-3 py-1 rounded-full self-start border border-green-700">
                  3 Issues
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDetails;
