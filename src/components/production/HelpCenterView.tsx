import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Radio,
  FileText,
  Sparkles,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  LifeBuoy,
  PhoneCall,
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export const HelpCenterView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean | null>>({});

  // Ticket creation state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Device Synchronization');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'All Articles', icon: BookOpen },
    { id: 'devices', label: 'Wearables & Bluetooth', icon: Radio },
    { id: 'labs', label: 'Lab Reports & OCR', icon: FileText },
    { id: 'ai', label: 'AI Models & Simulations', icon: Sparkles },
    { id: 'billing', label: 'Billing & Account', icon: CreditCard },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
  ];

  const faqs = [
    {
      id: 'faq-1',
      category: 'devices',
      question: 'How do I pair my Polar H10 or Apple Watch via Web Bluetooth?',
      answer: 'Ensure Bluetooth is enabled on your host operating system and browser. Click the "Live Workout HUD" button in the top navbar, then click "Connect BLE Heart Rate Sensor". Select your HR device from the native browser pairing prompt. VITALOS will establish a real-time GATT socket receiving continuous BPM and RR-intervals.'
    },
    {
      id: 'faq-2',
      category: 'labs',
      question: 'Which formats are supported for Clinical Lab Report OCR ingestion?',
      answer: 'Our Gemini-powered multi-modal vision parser accepts PDF, PNG, JPEG, and TIFF lab panels from major diagnostic vendors (Quest Diagnostics, LabCorp, BioReference). The engine automatically extracts analyte names, numeric values, reference intervals, units, and out-of-range tags.'
    },
    {
      id: 'faq-3',
      category: 'ai',
      question: 'How does the "Why Am I Different Today?" diagnostic engine work?',
      answer: 'The engine calculates a rolling 90-day baseline for your resting heart rate, HRV RMSSD, sleep architecture, and training load. When today’s metrics deviate by more than 1.5 standard deviations from your equilibrium, our sports physiology AI cross-references sleep debt, alcohol markers, and muscle soreness to pinpoint the root driver.'
    },
    {
      id: 'faq-4',
      category: 'privacy',
      question: 'Does VITALOS sell or share my health telemetry with third parties?',
      answer: 'Never. VITALOS maintains a strict Zero-Sale guarantee. We do not sell, license, or broker your biometrics to insurance firms, advertisers, or data aggregators. You can export your full raw dossier in standard JSON/CSV or trigger a permanent 72-hour cryptographic wipe at any moment.'
    },
    {
      id: 'faq-5',
      category: 'billing',
      question: 'Can I get a refund if VITALOS Pro does not meet my athletic needs?',
      answer: 'Yes! We provide a 30-day no-questions-asked money-back guarantee on all software subscriptions and hardware sensors. Simply reach out to billing@vitalos.health or use the self-serve cancel button in Account Settings.'
    },
    {
      id: 'faq-6',
      category: 'devices',
      question: 'Why does my live heart rate show a simulated waveform in iframe preview?',
      answer: 'When Web Bluetooth permissions are sandboxed inside certain third-party iframe containers, VITALOS automatically falls back to high-fidelity synthetic physiological simulation so you can explore real-time HUD metrics without browser security blocks.'
    }
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 3000);
  };

  const handleFeedback = (id: string, isHelpful: boolean) => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: isHelpful }));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Header Banner & Global Search */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-10 border border-slate-800 text-center space-y-4 shadow-md relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
            <LifeBuoy className="w-3.5 h-3.5" /> 24/7 Clinical & Technical Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">How can we assist your health journey?</h1>
          <p className="text-xs text-slate-400">
            Search our comprehensive documentation, troubleshooting guides, and integration protocols.
          </p>

          <div className="relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles e.g. 'Bluetooth sync', 'Quest PDF', 'Cancel membership'..."
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">All VITALOS Systems Operational</span>
          <span className="text-slate-400 hidden sm:inline">• 99.98% Uptime SLA</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <span>BLE Gateway: <strong className="text-emerald-400">Normal</strong></span>
          <span>Gemini OCR: <strong className="text-emerald-400">Active</strong></span>
          <span>OAuth Bridges: <strong className="text-emerald-400">Operational</strong></span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQs and Contact Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Knowledge Base Accordion */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider px-1">
            Frequently Answered Questions ({filteredFaqs.length})
          </h2>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              const feedback = helpfulFeedback[faq.id];

              return (
                <div
                  key={faq.id}
                  className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-white hover:text-cyan-300"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 text-xs text-slate-300 space-y-3 border-t border-slate-800/80 pt-3 leading-relaxed">
                      <p>{faq.answer}</p>

                      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                        <span>Was this article helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(faq.id, true)}
                            className={`p-1 rounded flex items-center gap-1 ${feedback === true ? 'text-emerald-400 font-bold' : 'hover:text-white'}`}
                          >
                            <ThumbsUp className="w-3 h-3" /> Yes
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, false)}
                            className={`p-1 rounded flex items-center gap-1 ${feedback === false ? 'text-rose-400 font-bold' : 'hover:text-white'}`}
                          >
                            <ThumbsDown className="w-3 h-3" /> No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Direct Ticket Submission Form */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-md h-fit">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Submit a Support Ticket</h3>
            </div>
            <p className="text-xs text-slate-400">Our engineering & physiology specialists respond in &lt; 2 hours.</p>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option>Device Synchronization & Bluetooth</option>
                <option>Clinical Lab OCR Parser Discrepancy</option>
                <option>Billing, Invoices & Hardware Orders</option>
                <option>Security, Privacy & Data Export</option>
                <option>Feature Request / AI Feedback</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your question..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Detailed Description</label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                rows={4}
                placeholder="Include sensor make/model or error details..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 resize-none"
                required
              />
            </div>

            {ticketSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ticket #VTK-8492 logged! Priority support notified.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Support Ticket
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
