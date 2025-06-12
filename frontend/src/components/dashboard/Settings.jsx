// src/components/dashboard/Settings.jsx
import React from 'react';

const Settings = () => {  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      <div className="bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-700">
        <div className="border-b border-zinc-700 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-white">User Preferences</h2>
        </div>
          <div className="space-y-6">
          {/* Account Settings */}
          <div>
            <h3 className="font-medium text-lg mb-3 text-white">Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm">
                  Change Password
                </button>
              </div>
            </div>
          </div>
            {/* Scan Settings */}
          <div className="pt-6 border-t border-zinc-700">
            <h3 className="font-medium text-lg mb-3 text-white">Scan Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Default Scan Depth</label>
                <select className="w-full p-2 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400">
                  <option>Light (Faster)</option>
                  <option>Standard</option>
                  <option>Deep (Slower)</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="notifications" 
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 bg-zinc-900 border-zinc-500 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-zinc-300">
                  Email notifications when scan completes
                </label>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-6 border-t border-zinc-700">
            <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
