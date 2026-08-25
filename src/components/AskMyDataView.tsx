import React, { useState } from 'react';
import {
  Zap,
  Send,
  Sparkles,
  ShieldCheck,
  Radio,
  FileText,
  Activity,
  Heart,
  Moon,
  TrendingUp,
  RefreshCw,
  Info
} from 'lucide-react';
import { askMyData, AskDataResponse } from '../services/api';

interface AskMyDataViewProps {
  healthContext: any;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  responseObj?: AskDataResponse;
  timestamp: string;
}

export const AskMyDataView: React.FC<AskMyDataViewProps> = ({ healthContext, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am your VITALOS Health Copilot. You can ask me any question about your connected workouts, sleep stages, resting heart rate, blood biomarkers, or nutrition trends. Every answer will be grounded directly in your verified records.',
      timestamp: '08:00 AM'
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
    }
  }, [initialQuery]);

  const presetQueries = [
    'Why was my recovery higher this morning?',
    'How active was I over the last 14 days?',
    'Compare my resting heart rate to baseline',
    'Summarize my latest Quest Diagnostics blood biomarkers',
    'What should I eat to fuel my Zone 2 runs?'
  ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const result = await askMyData(queryText, healthContext);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        responseObj: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Ask My Data failed:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to process health query. Please check network connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex items-center justify-between shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Ask My Data — Health Copilot</h1>
          </div>
          <p className="text-xs text-slate-300">
            Natural language interface into your complete unified health database. VITALOS distinguishes strictly between observed data, physiological inferences, and safe wellness recommendations.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> Zero Hallucinations Policy
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Suggested Queries:</span>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(query)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all text-left"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4 min-h-[420px] max-h-[560px] overflow-y-auto shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`rounded-2xl p-4 max-w-2xl text-xs space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-semibold rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

              {/* If rich structured response with citations */}
              {msg.responseObj && (
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                  {/* Data Citations Table */}
                  {msg.responseObj.citations && msg.responseObj.citations.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Verified Data Points Cited:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {msg.responseObj.citations.map((c, cIdx) => (
                          <div key={cIdx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between">
                            <span className="text-slate-300 font-medium">{c.metric}</span>
                            <span className="text-cyan-400 font-mono font-semibold">{c.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation Callout */}
                  {msg.responseObj.recommendation && (
                    <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Recommended Action:</strong> {msg.responseObj.recommendation}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Confidence: <strong className="text-emerald-400">{msg.responseObj.confidence}</strong></span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-950 rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Cross-referencing telemetry, sleep stages, and laboratory markers...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 focus-within:border-cyan-500 transition-all shadow-lg"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about your health data (e.g. 'Why did my resting HR increase?')..."
          className="flex-1 px-4 py-2.5 text-xs bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          <Send className="w-3.5 h-3.5" /> Ask
        </button>
      </form>

    </div>
  );
};
