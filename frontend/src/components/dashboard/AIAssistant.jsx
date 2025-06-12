// src/components/dashboard/AIAssistant.jsx
import React, { useState } from 'react';

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'assistant', message: 'Hello! I\'m your security scanning assistant. How can I help you analyze your scan results today?' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user query to conversation
    const userMessage = { role: 'user', message: query };
    setConversation(prev => [...prev, userMessage]);
    
    // Simulate AI processing
    setLoading(true);
    setTimeout(() => {
      // Add AI response
      const aiResponses = [
        "Based on your latest scan, I've identified 3 critical XSS vulnerabilities that you should address immediately.",
        "I've analyzed the scan results and found potential SQL injection points in your form submissions. Would you like me to suggest some fixes?",
        "The scan shows your site is using outdated libraries with known vulnerabilities. I recommend updating them to the latest versions.",
        "I don't see any major security issues in this scan, but there are some best practices you could implement to improve overall security posture."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setConversation(prev => [...prev, { role: 'assistant', message: randomResponse }]);
      setLoading(false);
      setQuery('');
    }, 1500);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">AI Security Assistant</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-zinc-800 rounded-2xl shadow-lg p-6 mb-6 border border-zinc-700">
            <div className="border-b border-zinc-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-white">Conversation</h2>
            </div>
            
            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-1">              {conversation.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-xl ${
                    msg.role === 'assistant' 
                      ? 'bg-zinc-700 text-zinc-200' 
                      : 'bg-violet-600 text-white'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
                {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-700 text-zinc-200 p-3 rounded-xl max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
              <form onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-white"
                  placeholder="Ask about your scan results or security advice..."
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-violet-600 text-white px-4 py-2 rounded-r-xl hover:bg-violet-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-zinc-800 rounded-2xl shadow-lg p-6 mb-6 border border-zinc-700">
            <h3 className="font-bold text-lg mb-4 text-white">Suggested Questions</h3>
            <ul className="space-y-2">
              {[
                "Explain the XSS vulnerabilities found",
                "What are the most critical issues?",
                "How can I fix the SQL injection risk?",
                "Generate a security report",
                "What security headers should I add?"
              ].map((question, index) => (
                <li key={index}>
                  <button
                    onClick={() => setQuery(question)}
                    className="text-left text-violet-400 hover:text-violet-300 w-full p-2 text-sm hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
            <div className="bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-700">
            <h3 className="font-bold text-lg mb-4 text-white">Recent Scans</h3>
            <ul className="space-y-2">
              {[
                { date: 'Jun 10, 2025', target: 'example.com', issues: 18 },
                { date: 'Jun 08, 2025', target: 'testsite.org', issues: 7 },
                { date: 'Jun 05, 2025', target: 'secureapp.net', issues: 3 }
              ].map((scan, index) => (
                <li key={index} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm text-white">{scan.target}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scan.issues > 10 
                        ? 'bg-red-900 text-red-200 border border-red-700' 
                        : scan.issues > 5 
                          ? 'bg-yellow-900 text-yellow-200 border border-yellow-700' 
                          : 'bg-green-900 text-green-200 border border-green-700'
                    }`}>
                      {scan.issues} issues
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{scan.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
