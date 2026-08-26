import React, { useState } from 'react';
import { MessageSquare, X, ShieldAlert, PhoneCall, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface FloatingSupportBubbleProps {
  onOpenHelpCenter: () => void;
  onOpenAskData: () => void;
}

export const FloatingSupportBubble: React.FC<FloatingSupportBubbleProps> = ({
  onOpenHelpCenter,
  onOpenAskData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSubmitted(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div id="floating-support-bubble" className="fixed bottom-6 left-6 z-40">
      {isOpen ? (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl w-80 text-xs space-y-3 animate-scaleUp text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-bold text-white text-xs">VITALOS Fast Support</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              aria-label="Close support bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAskData();
              }}
              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex flex-col items-start gap-1 text-left transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-[11px]">Ask AI Copilot</span>
              <span className="text-[9px] text-slate-400">Query your health data</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenHelpCenter();
              }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 flex flex-col items-start gap-1 text-left transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-[11px]">Help & FAQs</span>
              <span className="text-[9px] text-slate-400">Guides & Bluetooth specs</span>
            </button>
          </div>

          {/* Quick Feedback Form */}
          <div className="pt-2 border-t border-slate-800">
            {feedbackSubmitted ? (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-center text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Feedback Sent to Engineering!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-2">
                <label className="text-[10px] text-slate-400 font-semibold block">
                  Report a Sensor Sync Bug or Metric Request:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="E.g. Apple Watch HR disconnect..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
                    aria-label="Send feedback"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-1 text-[9px] text-slate-400 text-center">
            Emergency? Dial 911 or visit your nearest trauma center.
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open support and assistance bubble"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-cyan-400 border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 group"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">Support & Help</span>
        </button>
      )}
    </div>
  );
};
