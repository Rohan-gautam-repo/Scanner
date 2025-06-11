// src/components/dashboard/VulnTable.jsx
import React, { useState } from 'react';

const VulnTable = ({ vulnerabilities = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Vulnerabilities</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search vulnerabilities..."
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-48">
          <select
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fix</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((vuln) => (
                <tr key={vuln.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{vuln.url}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{vuln.type}</td>
                  <td className="py-3 px-4">
                    <span className={`${getSeverityColor(vuln.severity)} text-xs font-medium px-2.5 py-1 rounded-full`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{vuln.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate">{vuln.fix}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
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
