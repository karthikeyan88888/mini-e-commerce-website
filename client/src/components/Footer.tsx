import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Headphones, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] text-white pt-16 pb-12">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8 rounded-2xl bg-[#0c0d10] border border-white/[0.06]">
          <Link to="/support" className="flex items-start gap-4 group">
            <div className="p-2.5 rounded-lg bg-copper/10 border border-copper/30 text-copper group-hover:bg-copper group-hover:text-black transition-colors">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-white group-hover:text-copper transition-colors">
                Bespoke Acoustic Voicing
              </h4>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Hand-matched drivers individually calibrated with &lt; 0.5dB channel tolerance.
              </p>
            </div>
          </Link>

          <Link to="/support" className="flex items-start gap-4 group">
            <div className="p-2.5 rounded-lg bg-copper/10 border border-copper/30 text-copper group-hover:bg-copper group-hover:text-black transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-white group-hover:text-copper transition-colors">
                3-Year Studio Warranty
              </h4>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Machined aerospace materials backed by comprehensive mechanical coverage.
              </p>
            </div>
          </Link>

          <Link to="/orders" className="flex items-start gap-4 group">
            <div className="p-2.5 rounded-lg bg-copper/10 border border-copper/30 text-copper group-hover:bg-copper group-hover:text-black transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-white group-hover:text-copper transition-colors">
                Expedited Courier Delivery
              </h4>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Insured priority dispatch with real-time end-to-end telemetry tracking.
              </p>
            </div>
          </Link>

          <Link to="/support" className="flex items-start gap-4 group">
            <div className="p-2.5 rounded-lg bg-copper/10 border border-copper/30 text-copper group-hover:bg-copper group-hover:text-black transition-colors">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-white group-hover:text-copper transition-colors">
                30-Day Pure Audition
              </h4>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Experience NEXORO in your personal listening environment risk-free.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-copper flex items-center justify-center font-bold text-black text-xs font-headline">
              N
            </div>
            <span className="text-lg font-extrabold font-headline tracking-widest text-white">
              NEXORO
            </span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Precision-engineered electroacoustic systems for discerning listeners, master engineers, and purists.
          </p>
          <div className="text-[11px] font-mono text-copper tracking-wider">
            SAN FRANCISCO • TOKYO • BERLIN
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h5 className="text-xs font-bold font-headline uppercase tracking-widest text-white mb-4">
            Collection
          </h5>
          <ul className="space-y-2.5 text-xs text-white/60">
            <li><Link to="/catalog?category=HEADPHONES" className="hover:text-copper transition-colors">Flagship Headphones</Link></li>
            <li><Link to="/catalog?category=AMPLIFICATION" className="hover:text-copper transition-colors">DACs & Amplification</Link></li>
            <li><Link to="/catalog?category=ACCESSORIES" className="hover:text-copper transition-colors">Cables & Hardware</Link></li>
            <li><Link to="/catalog?category=ACOUSTICS" className="hover:text-copper transition-colors">Acoustic Treatment</Link></li>
          </ul>
        </div>

        {/* Support & Account */}
        <div>
          <h5 className="text-xs font-bold font-headline uppercase tracking-widest text-white mb-4">
            Concierge & Care
          </h5>
          <ul className="space-y-2.5 text-xs text-white/60">
            <li><Link to="/support" className="hover:text-copper transition-colors">Customer Care & Support</Link></li>
            <li><Link to="/support" className="hover:text-copper transition-colors">3-Year Studio Warranty</Link></li>
            <li><Link to="/orders" className="hover:text-copper transition-colors">Track Your Order</Link></li>
            <li><Link to="/support" className="hover:text-copper transition-colors">30-Day Audition Policy</Link></li>
            <li><Link to="/cart" className="hover:text-copper transition-colors">Shopping Cart</Link></li>
            <li><Link to="/login" className="hover:text-copper transition-colors">Client Account</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-copper transition-colors">Merchant Portal</Link></li>
          </ul>
        </div>

        {/* Engineering Philosophy */}
        <div>
          <h5 className="text-xs font-bold font-headline uppercase tracking-widest text-white mb-4">
            Engineering
          </h5>
          <p className="text-xs text-white/50 leading-relaxed mb-3">
            “Nothing unnecessary. Everything intentional.” Every curve and material serves acoustic purity.
          </p>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/60 font-mono">
            STATUS: ALL SYSTEMS NOMINAL
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p>© {new Date().getFullYear()} NEXORO Acoustic Systems Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Engineering</span>
          <span className="hover:text-white cursor-pointer transition-colors">Compliance</span>
        </div>
      </div>
    </footer>
  );
};
