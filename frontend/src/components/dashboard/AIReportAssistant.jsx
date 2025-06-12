// src/components/dashboard/AIReportAssistant.jsx
import React, { useState } from 'react';

const AIReportAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you analyze your scan results and provide remediation tips. What would you like to know?' },
  ]);
  const [loading, setLoading] = useState(false);

  // Suggested questions
  const suggestions = [
    'Give me a summary of vulnerabilities',
    'How do I fix XSS issues?',
    'Explain SQL injection remediation',
    'How can I improve security?',
  ];

  // Simulated responses
  const simulatedResponses = {
    'summary': 'Based on your most recent scan, I found 18 vulnerabilities (8 high, 7 medium, 3 low). The most critical issues are XSS vulnerabilities in the user profile form and SQL injection in the login endpoint.',
    'xss': 'To fix the XSS vulnerabilities:\n1. Implement input validation\n2. Use output encoding for dynamic content\n3. Consider implementing Content-Security-Policy headers\n4. Use modern frameworks that automatically escape content',
    'sql': 'To fix SQL injection:\n1. Use prepared statements or parameterized queries\n2. Apply the principle of least privilege\n3. Validate user inputs\n4. Consider using an ORM that handles SQL escaping',
    'how': 'To reduce your vulnerability surface:\n1. Keep all software updated\n2. Implement a WAF\n3. Conduct regular security training\n4. Consider bug bounty programs\n5. Use SAST/DAST tools in your CI/CD pipeline',
    'help': 'I can help with:\n- Summarizing vulnerability reports\n- Providing remediation guidance\n- Explaining technical concepts\n- Prioritizing security issues\n- Suggesting best practices',
  };

  // Simulated generated report (example)
  const generatedReport = {
    summary: 'Scan completed on Jun 10, 2025. 18 vulnerabilities found (8 high, 7 medium, 3 low).',
    details: [
      { type: 'XSS', count: 8, description: 'Cross-Site Scripting vulnerabilities in user profile and search.' },
      { type: 'SQL Injection', count: 5, description: 'SQLi in login and product endpoints.' },
      { type: 'CSRF', count: 3, description: 'Missing CSRF tokens in forms.' },
      { type: 'Other', count: 2, description: 'Minor issues in settings and contact forms.' },
    ],
    recommendation: 'Prioritize fixing high severity issues. Apply input validation, use parameterized queries, and implement security headers.'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    handleQuery(query);
  };

  const handleQuery = (text) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setQuery('');
    
    // Simulate response based on keywords
    setTimeout(() => {
      let response;
      const lowerQuery = text.toLowerCase();
      
      if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
        response = simulatedResponses.summary;
      } else if (lowerQuery.includes('xss') || lowerQuery.includes('cross-site')) {
        response = simulatedResponses.xss;
      } else if (lowerQuery.includes('sql') || lowerQuery.includes('injection')) {
        response = simulatedResponses.sql;
      } else if (lowerQuery.includes('how') || lowerQuery.includes('improve') || lowerQuery.includes('reduce')) {
        response = simulatedResponses.how;
      } else if (lowerQuery.includes('help') || lowerQuery.includes('what can you')) {
        response = simulatedResponses.help;
      } else {
        response = "I don't have specific information about that. Could you try asking about vulnerability summaries, specific vulnerability types like XSS or SQL injection, or general security improvements?";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Security Assistant</h2>
        <span className="flex items-center text-green-500 text-xs">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
          Online
        </span>
      </div>

      {/* Generated Report Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4 mb-2">
        <h3 className="font-semibold text-gray-700 mb-1">Latest Scan Report</h3>
        <p className="text-sm text-gray-700 mb-2">{generatedReport.summary}</p>
        <ul className="mb-2">
          {generatedReport.details.map((item, idx) => (
            <li key={idx} className="flex items-center text-xs text-gray-600 mb-1">
              <span className="font-bold w-24 inline-block">{item.type}:</span>
              <span className="font-semibold text-gray-800 w-8 inline-block">{item.count}</span>
              <span className="ml-2">{item.description}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs text-blue-700 font-medium">{generatedReport.recommendation}</div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col gap-2">
        <div className="h-72 overflow-y-auto bg-gray-50 rounded-xl p-4 mb-2 border border-gray-100">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-3 ${
                message.role === 'user' 
                  ? 'flex justify-end' 
                  : 'flex justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">AI</div>
              )}
              <div 
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center ml-2">You</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">AI</div>
              <div className="bg-gray-200 text-gray-800 p-3 rounded-xl rounded-bl-none max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div className="mb-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleQuery(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full border border-gray-200"
              disabled={loading}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about vulnerabilities or how to fix them..."
            className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-colors text-sm font-semibold"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIReportAssistant;
