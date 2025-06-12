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
    <div className="bg-zinc-800 rounded-2xl shadow-lg p-6 mt-6 border border-zinc-700">
      <h2 className="text-xl font-bold text-white mb-4">Export Report</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleExportPDF}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white p-4 rounded-xl hover:bg-violet-700 transition-colors"
        >
          <span className="text-lg">📄</span>
          Export as PDF
        </button>
        
        <button
          onClick={handleExportHTML}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-700 text-white p-4 rounded-xl hover:bg-zinc-600 transition-colors"
        >
          <span className="text-lg">🌐</span>
          Export as HTML
        </button>
      </div>
      
      <div className="mt-4 bg-zinc-900 border border-zinc-600 text-zinc-300 p-4 rounded-lg">
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
