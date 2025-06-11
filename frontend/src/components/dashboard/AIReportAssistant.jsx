// src/components/dashboard/AIReportAssistant.jsx
import React, { useState } from 'react';

const AIReportAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you analyze your scan results and provide remediation tips. What would you like to know?' },
  ]);
  const [loading, setLoading] = useState(false);

  // Simulated responses
  const simulatedResponses = {
    'summary': 'Based on your most recent scan, I found 18 vulnerabilities (8 high, 7 medium, 3 low). The most critical issues are XSS vulnerabilities in the user profile form and SQL injection in the login endpoint.',
    'xss': 'To fix the XSS vulnerabilities:\n1. Implement input validation\n2. Use output encoding for dynamic content\n3. Consider implementing Content-Security-Policy headers\n4. Use modern frameworks that automatically escape content',
    'sql': 'To fix SQL injection:\n1. Use prepared statements or parameterized queries\n2. Apply the principle of least privilege\n3. Validate user inputs\n4. Consider using an ORM that handles SQL escaping',
    'how': 'To reduce your vulnerability surface:\n1. Keep all software updated\n2. Implement a WAF\n3. Conduct regular security training\n4. Consider bug bounty programs\n5. Use SAST/DAST tools in your CI/CD pipeline',
    'help': 'I can help with:\n- Summarizing vulnerability reports\n- Providing remediation guidance\n- Explaining technical concepts\n- Prioritizing security issues\n- Suggesting best practices',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);
    
    // Simulate response based on keywords
    setTimeout(() => {
      let response;
      const lowerQuery = query.toLowerCase();
      
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
      setQuery('');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">AI Security Assistant</h2>
      
      <div className="h-96 overflow-y-auto bg-gray-50 rounded-xl p-4 mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 ${
              message.role === 'user' 
                ? 'flex justify-end' 
                : 'flex justify-start'
            }`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start mb-3">
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
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about vulnerabilities or how to fix them..."
          className="flex-grow p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIReportAssistant;
