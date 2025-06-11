// src/components/dashboard/ReportExport.jsx
import React from 'react';

const ReportExport = () => {
  const handleExportPDF = () => {
    // In a real implementation, this would use jsPDF and html2canvas
    alert('Exporting PDF report...');
  };

  const handleExportHTML = () => {
    // In a real implementation, this would generate an HTML report
    alert('Exporting HTML report...');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Export Report</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleExportPDF}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg">📄</span>
          Export as PDF
        </button>
        
        <button
          onClick={handleExportHTML}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <span className="text-lg">🌐</span>
          Export as HTML
        </button>
      </div>
      
      <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
        <p className="text-sm">
          Reports include all scan details, vulnerabilities found, and recommended fixes. 
          PDF reports are ideal for sharing with stakeholders, while HTML reports provide 
          additional interactivity.
        </p>
      </div>
    </div>
  );
};

export default ReportExport;
