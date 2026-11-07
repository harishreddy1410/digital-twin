'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Briefcase, 
  Code, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Cloud, 
  Zap,
  MapPin,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Server
} from 'lucide-react';

// Safely access environment variables with browser fallback
const LAMBDA_URL = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_LAMBDA_URL) 
  ? process.env.NEXT_PUBLIC_LAMBDA_URL 
  : "https://i5phn2lucifwmmuww7szzf5zsa0kgzfr.lambda-url.ap-south-1.on.aws/";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Harry's Digital Twin. Ask me anything about his enterprise architecture experience, AWS cloud expertise, Python/C# backend development, or career achievements."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'profile' for mobile view toggle
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });

      const data = await response.json();
      const reply = data.response || data.message || (typeof data === 'string' ? data : JSON.stringify(data));

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('API Error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error connecting to the backend. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSuggestion = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Native inline stylesheet without styled-jsx prop warnings */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}</style>

      {/* MOBILE NAVIGATION TAB SWITCHER */}
      <div className="flex lg:hidden border-b border-slate-800 bg-slate-900/80 p-2 gap-2 shrink-0 z-20">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'profile' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 bg-slate-800/50'
          }`}
        >
          <User size={14} /> Profile & Resume
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'chat' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 bg-slate-800/50'
          }`}
        >
          <Bot size={14} /> AI Digital Twin
        </button>
      </div>

      {/* LEFT PANEL: Executive Profile & Portfolio Overview */}
      <div className={`w-full lg:w-1/2 border-r border-slate-800/80 flex-col bg-slate-900/30 backdrop-blur-2xl overflow-y-auto ${
        activeTab === 'profile' ? 'flex' : 'hidden lg:flex'
      }`}>
        
        {/* Header Hero Banner */}
        <div className="p-6 lg:p-8 border-b border-slate-800/80 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles size={13} className="text-indigo-400 animate-pulse" /> Live AI Agent
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center gap-1">
              <Server size={11} className="text-emerald-400" /> ap-south-1
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
            Harish Munireddy
          </h1>
          <p className="text-indigo-400 font-medium text-sm lg:text-base mt-1 flex items-center gap-2">
            <Cpu size={16} className="text-indigo-400 shrink-0" /> Principal Engineer & Cloud Specialist
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800/60">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin size={13} className="text-indigo-400" /> Bengaluru, Karnataka, India
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={13} className="text-emerald-400" /> Deloitte & Nagarro Alum
            </span>
          </div>
        </div>

        {/* Portfolio Content */}
        <div className="p-6 lg:p-8 space-y-8 flex-1">
          
          {/* Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Layers size={14} className="text-indigo-400" /> Professional Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
              Principal Engineer with extensive experience in cloud-native serverless architecture, microservices, and distributed AI agent workflows. Proven track record driving large-scale cloud transformations across enterprise systems.
            </p>
          </div>

          {/* Work Experience Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Briefcase size={14} className="text-indigo-400" /> Career Highlights
            </h2>
            
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-sm group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">Principal Engineer</h3>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">Deloitte • Bengaluru, India</p>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">
                  Current
                </span>
              </div>
              <p className="text-xs lg:text-sm text-slate-300 mt-3 leading-relaxed">
                Architecting serverless platforms, enterprise cloud pipelines, and generative AI agent core capabilities for large distributed infrastructures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-sm group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">Software Developer</h3>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">Nagarro</p>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-slate-300 mt-3 leading-relaxed">
                Engineered high-concurrency C# .NET Core backends, REST API services, and Python automated data processing pipelines for enterprise cloud migration.
              </p>
            </div>
          </div>

          {/* Core Skills & Tech Stack */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Code size={14} className="text-indigo-400" /> Core Tech Matrix
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'AWS (Lambda, Bedrock)', 
                'Python Backend', 
                'C# / .NET Core', 
                'Terraform (IaC)', 
                'Serverless Framework', 
                'AI Agent Workflows', 
                'Next.js / React',
                'Microservices',
                'REST API Design'
              ].map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 transition-colors cursor-default flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 size={12} className="text-indigo-400" /> {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL: Live AI Digital Twin Interactive Chat */}
      <div className={`w-full lg:w-1/2 flex-col bg-slate-950 ${
        activeTab === 'chat' ? 'flex' : 'hidden lg:flex'
      }`}>
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-100 block">Harish's Digital Twin</span>
              <span className="text-[11px] text-slate-400">AWS Lambda Bedrock AgentCore & Multi-LLM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 hidden sm:flex items-center gap-1.5">
              <Terminal size={12} className="text-indigo-400" /> Online
            </span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-indigo-400 border border-slate-800'
                }`}
              >
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className="flex flex-col space-y-1 max-w-[85%] lg:max-w-[75%]">
                <span className={`text-[10px] font-mono text-slate-500 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.role === 'user' ? 'You' : 'Digital Twin'}
                </span>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-indigo-400 border border-slate-800 flex items-center justify-center shadow-md">
                <Bot size={18} />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl rounded-tl-xs text-sm text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Clickable Prompt Suggestions */}
        <div className="px-4 lg:px-6 py-2 border-t border-slate-800/40 bg-slate-950/60 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Zap size={11} className="text-amber-400" /> Try asking:
          </span>
          {[
            "What is your AWS experience?",
            "Tell me about your time at Deloitte.",
            "What backend tech do you use?"
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handlePromptSuggestion(promptText)}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-colors whitespace-nowrap"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Harry's AWS experience, architecture, or skills..."
              className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-3 rounded-2xl transition-all font-medium flex items-center justify-center shadow-lg shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}