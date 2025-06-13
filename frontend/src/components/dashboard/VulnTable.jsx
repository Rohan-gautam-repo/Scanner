// src/components/dashboard/VulnTable.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VulnTable = ({ vulnerabilities = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  // Default data if none is provided
  const defaultVulnerabilities = [
    {
      id: 1,
      url: '/api/users/profile',
      type: 'XSS',
      severity: 'High',
      description: 'Reflected Cross-Site Scripting in user profile endpoint',
      fix: 'Implement input validation and output encoding',
    },
    {
      id: 2,
      url: '/api/login',
      type: 'SQL Injection',
      severity: 'High',
      description: 'SQL injection vulnerability in login form',
      fix: 'Use parameterized queries and prepared statements',
    },
    {
      id: 3,
      url: '/api/products/search',
      type: 'XSS',
      severity: 'Medium',
      description: 'Stored XSS in product search functionality',
      fix: 'Sanitize user inputs and implement CSP headers',
    },
    {
      id: 4,
      url: '/contact',
      type: 'CSRF',
      severity: 'Medium',
      description: 'Missing CSRF token in contact form',
      fix: 'Implement anti-CSRF tokens for all state-changing operations',
    },
    {
      id: 5,
      url: '/api/settings',
      type: 'Insecure Direct Object Reference',
      severity: 'Low',
      description: 'User can access settings for other users by changing IDs',
      fix: 'Implement proper access controls and user authorization checks',
    },
  ];

  // Use provided data or fall back to default
  const tableData = vulnerabilities.length > 0 ? vulnerabilities : defaultVulnerabilities;

  // Filter and search functionality
  const filteredData = tableData.filter(vuln => {
    const matchesSearch = 
      vuln.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      vuln.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && vuln.severity.toLowerCase() === filter.toLowerCase();
  });
  
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-900/60 text-red-200 border border-red-700/50 backdrop-blur-sm';
      case 'medium':
        return 'bg-amber-800/60 text-amber-200 border border-amber-700/50 backdrop-blur-sm';
      case 'low':
        return 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 backdrop-blur-sm';
      default:
        return 'bg-zinc-700/60 text-zinc-200 border border-zinc-600/50 backdrop-blur-sm';
    }
  };
  
  const navigateToScanDetails = () => {
    navigate('/dashboard/scan-details');
  };

  return (
    <div className="glass-card p-6 mt-6 dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold gradient-text">Vulnerabilities</h2>
        <button
          onClick={navigateToScanDetails}
          className="text-sm text-violet-300 hover:text-violet-200 flex items-center gap-1 transition-colors"
        >
          View All Details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search vulnerabilities..."
            className="w-full p-3 bg-zinc-900/50 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-48">
          <select
            className="w-full p-3 bg-zinc-900/50 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full bg-zinc-900/50 rounded-xl overflow-hidden">
          <thead className="bg-zinc-900/80">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">URL</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">Severity</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-violet-300 uppercase tracking-wider">Fix</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-zinc-800/70">
            {filteredData.length > 0 ? (
              filteredData.map((vuln) => (
                <tr 
                  key={vuln.id} 
                  className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={navigateToScanDetails}
                >
                  <td className="py-3 px-4 text-sm text-white font-medium">{vuln.url}</td>
                  <td className="py-3 px-4 text-sm text-violet-100">{vuln.type}</td>
                  <td className="py-3 px-4">
                    <span className={`${getSeverityColor(vuln.severity)} text-xs font-medium px-2.5 py-1 rounded-full shadow-sm`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-violet-100">{vuln.description}</td>
                  <td className="py-3 px-4 text-sm text-violet-100 max-w-xs truncate">{vuln.fix}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-violet-300">
                  No vulnerabilities found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VulnTable;
