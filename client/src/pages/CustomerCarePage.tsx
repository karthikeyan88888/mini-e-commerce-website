import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Headphones,
  Truck,
  RotateCcw,
  Search,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import { api } from '../api/client';

export const CustomerCarePage: React.FC = () => {
  const navigate = useNavigate();

  // Quick Tracking Lookup State
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingError, setTrackingError] = useState('');

  // Ticket Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    category: 'Acoustic Calibration & Technical Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{
    ticketId: string;
    message: string;
    estimatedResponseTime: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingInput.trim();
    if (!query) {
      setTrackingError('Please enter a valid tracking number or order ID');
      return;
    }
    setTrackingError('');
    navigate(`/orders/${query}`);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await api.post('/support/ticket', formData);
      setTicketResult({
        ticketId: res.data.ticketId,
        message: res.data.message,
        estimatedResponseTime: res.data.estimatedResponseTime,
      });
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        category: 'Acoustic Calibration & Technical Inquiry',
        message: '',
      });
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: 'How do I optimize DAC & amplifier pairing for NEXORO headphones?',
      category: 'ACOUSTICS',
      answer:
        'All NEXORO dynamic models (Apex Pro, Halo X1) operate at 32–36Ω impedance and perform exceptionally with mobile USB-C dongles or discrete desktop amplifiers. For our Vector Studio planar magnetic model (48Ω, open-back), we recommend a balanced 4-pin XLR amplifier output delivering at least 1.5W per channel to experience full planar transient dynamics.',
    },
    {
      question: 'What is covered under the official NEXORO 3-Year Studio Warranty?',
      category: 'WARRANTY',
      answer:
        'Every NEXORO audio system includes 3 full years of comprehensive hardware protection against component degradation, driver matching divergence exceeding 0.5dB, headband structural failures, and internal wiring faults. All claims are fulfilled with direct factory replacement parts or hand-calibrated new units.',
    },
    {
      question: 'How does the 30-Day In-Home Audition Guarantee work?',
      category: 'AUDITION',
      answer:
        'Audio is an intensely personal experience that depends on your listening room and chain. If your NEXORO system does not exceed expectations, initiate an audition return within 30 days of courier delivery. We provide a prepaid priority return label and issue a 100% refund with zero restocking penalties.',
    },
    {
      question: 'How fast are replacement cables and memory-foam pads dispatched?',
      category: 'DISPATCH',
      answer:
        'Certified consumables including pure OCC copper cables, lambskin cushions, and acoustic tuning filters are maintained in standing inventory across our San Francisco, Tokyo, and Berlin hubs. Warranty replacements are dispatched via insured express courier within 24 hours.',
    },
    {
      question: 'Can I track real-time courier telemetry for international shipments?',
      category: 'LOGISTICS',
      answer:
        'Yes. All domestic and international orders receive live 5-stage tracking telemetry (Placed → Confirmed → Packed → Shipped → Delivered). You can inspect real-time courier checkpoints directly using the tracking widget on this page or through your client dashboard.',
    },
  ];

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-white">
      {/* 1. Page Header */}
      <div className="mb-14 pb-8 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
          <span>CLIENT CONCIERGE & CARE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
          DEDICATED ACOUSTIC SUPPORT.
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
          Comprehensive warranty fulfillment, order telemetry, and tailored electroacoustic consultation. Our engineering team is dedicated to preserving the acoustic purity of your listening setup.
        </p>
      </div>

      {/* 2. Instant Order Telemetry Tracking Lookup Widget */}
      <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d0e12] via-[#121319] to-[#0d0e12] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
            LOGISTICS TELEMETRY
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-headline text-white">
            Instant Order Tracking Lookup
          </h2>
          <p className="text-xs text-white/50 mt-1 mb-6">
            Enter your tracking code (e.g. <span className="text-copper font-mono">NX-807242</span>) or Order ID to inspect real-time courier progression.
          </p>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter NX-XXXXXX or Order ID..."
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-copper hover:bg-copper-hover text-black font-extrabold text-xs tracking-widest uppercase rounded-xl shadow-lg shadow-copper/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>INSPECT STATUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {trackingError && (
            <p className="text-xs text-red-400 mt-2 font-mono">{trackingError}</p>
          )}
        </div>
      </div>

      {/* 3. Three Core Service Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-all space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center text-copper">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-headline text-white">
            3-Year Studio Warranty
          </h3>
          <p className="text-xs text-white/55 leading-relaxed">
            Full mechanical and electroacoustic coverage. If your driver deviates by more than 0.5dB or structural tolerance shifts, we provide hand-matched factory servicing.
          </p>
          <span className="text-[10px] font-mono text-copper font-semibold block pt-2">
            FACTORY REPLACEMENT GUARANTEE
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-all space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center text-copper">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-headline text-white">
            30-Day Pure Audition
          </h3>
          <p className="text-xs text-white/55 leading-relaxed">
            Experience our planar transducers and amplification in your home chain. If you are not thoroughly captivated, return with prepaid postage and zero restocking fees.
          </p>
          <span className="text-[10px] font-mono text-copper font-semibold block pt-2">
            ZERO-RISK IN-HOME TRIAL
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-all space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center text-copper">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-headline text-white">
            Acoustic Consultation
          </h3>
          <p className="text-xs text-white/55 leading-relaxed">
            Direct access to acoustic engineers for personalized advice on DAC synergy, balanced cable impedance, room treatment placement, and headphone voicing.
          </p>
          <span className="text-[10px] font-mono text-copper font-semibold block pt-2">
            DIRECT SPECIALIST ADVICE
          </span>
        </div>
      </div>

      {/* 4. Ticket Form and FAQ Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* LEFT: Contact & Support Ticket Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0e0f13] border border-white/[0.08] shadow-2xl space-y-6">
          <div className="pb-4 border-b border-white/[0.08]">
            <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
              CONCIERGE DISPATCH
            </span>
            <h2 className="text-2xl font-black font-headline text-white">
              Submit a Client Inquiry
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Provide your details and inquiry category. An acoustic care specialist will respond within 2 hours.
            </p>
          </div>

          {ticketResult ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-4 animate-fade-in text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-600 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                  TICKET RECORDED // {ticketResult.ticketId}
                </span>
                <h3 className="text-lg font-bold font-headline text-white mt-1">
                  Inquiry Successfully Dispatched
                </h3>
                <p className="text-xs text-white/70 mt-2 max-w-md mx-auto leading-relaxed">
                  {ticketResult.message}
                </p>
              </div>
              <div className="inline-block p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-copper">
                Estimated Specialist Response: <strong>{ticketResult.estimatedResponseTime}</strong>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setTicketResult(null)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors font-mono"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Alex Vance"
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. alex@nexoro.io"
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    Order / Serial # (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleFormChange}
                    placeholder="e.g. NX-807242 or NXR-APX-01"
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    Inquiry Division
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-copper font-sans cursor-pointer"
                  >
                    <option value="Acoustic Calibration & Technical Inquiry" className="bg-[#121317]">
                      Acoustic Calibration & Technical Inquiry
                    </option>
                    <option value="Warranty & Hardware Repair Claim" className="bg-[#121317]">
                      Warranty & Hardware Repair Claim
                    </option>
                    <option value="Order Dispatch & Courier Tracking" className="bg-[#121317]">
                      Order Dispatch & Courier Tracking
                    </option>
                    <option value="30-Day Audition Return Request" className="bg-[#121317]">
                      30-Day Audition Return Request
                    </option>
                    <option value="General Concierge Assistance" className="bg-[#121317]">
                      General Concierge Assistance
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                  Diagnostic Message / Inquiry Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  placeholder="Describe your audio setup, serial numbers, or inquiry in detail..."
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans leading-relaxed"
                />
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/40 text-xs text-red-300 font-semibold">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'DISPATCHING TICKET...' : 'DISPATCH INQUIRY TO CONCIERGE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* RIGHT: Direct Global Channels & Hubs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Contact Card */}
          <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/[0.08] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-white pb-3 border-b border-white/[0.08]">
              DIRECT COMMUNICATIONS
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-copper/10 text-copper flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Direct Concierge Email</span>
                  <a href="mailto:concierge@nexoro.io" className="text-white hover:text-copper transition-colors font-mono font-semibold">
                    concierge@nexoro.io
                  </a>
                  <p className="text-[11px] text-white/50 mt-0.5">Average reply time: under 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                <div className="p-2 rounded-lg bg-copper/10 text-copper flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Client Priority Phone</span>
                  <span className="text-white font-mono font-semibold">+1 (800) 840-6396</span>
                  <p className="text-[11px] text-white/50 mt-0.5">Toll-free 24/7 dedicated support</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/[0.06]">
                <div className="p-2 rounded-lg bg-copper/10 text-copper flex-shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Global Logistics Centers</span>
                  <span className="text-white font-mono">San Francisco &bull; Tokyo &bull; Berlin</span>
                  <p className="text-[11px] text-white/50 mt-0.5">All international hubs currently online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/[0.08] space-y-3">
            <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-white">
              CLIENT SELF-SERVICE
            </h4>
            <div className="space-y-2 text-xs">
              <Link
                to="/orders"
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-colors text-white/70 hover:text-white"
              >
                <span>View My Order History</span>
                <ArrowRight className="w-3.5 h-3.5 text-copper" />
              </Link>
              <Link
                to="/catalog"
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-colors text-white/70 hover:text-white"
              >
                <span>Browse Audio Systems & Specs</span>
                <ArrowRight className="w-3.5 h-3.5 text-copper" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Frequently Asked Questions Accordion */}
      <div className="pt-12 border-t border-white/[0.08]">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
            KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-headline text-white">
            FREQUENTLY ANSWERED INQUIRIES
          </h2>
          <p className="text-xs text-white/50 mt-2">
            Technical guidance regarding burn-in periods, cable interconnects, and warranty claims.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0e0f13] border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-copper uppercase font-bold border border-copper/30 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <span className="text-sm font-bold font-headline text-white">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-copper flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-white/70 leading-relaxed border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
