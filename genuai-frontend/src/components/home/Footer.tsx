import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-surface-container py-12 sm:py-16 text-on-surface-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GenuAI Technologies" className="w-8 h-8 object-contain" onError={(e) => ((e.target as HTMLElement).style.display = 'none')} />
              <div className="font-bold text-lg text-on-surface">
                Genu<span className="text-indigo-brand">AI</span> Technologies
              </div>
            </div>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              AI-Powered Recruitment Intelligence Platform. Transforming hiring through multi-modal assessment, anti-proxy verification, and intelligent talent distribution.
            </p>
            <div className="text-xs font-semibold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>One Assessment. Multiple Opportunities. Verified Talent.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Platform</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-indigo-brand transition-colors">Experience</a></li>
              <li><a href="#solution" className="hover:text-indigo-brand transition-colors">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-indigo-brand transition-colors">Pricing</a></li>
              <li><a href="#learning-hub" className="hover:text-indigo-brand transition-colors">Learning Hub</a></li>
              <li><a href="#contact" className="hover:text-indigo-brand transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div>
            <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Governance</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#terms-and-conditions" className="hover:text-indigo-brand transition-colors">Terms and Conditions</a></li>
              <li><a href="#terms-and-conditions" className="hover:text-indigo-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#candidates" className="hover:text-indigo-brand transition-colors">Candidate Hub</a></li>
              <li><a href="#companies" className="hover:text-indigo-brand transition-colors">Company Access</a></li>
              <li><a href="#admin" className="hover:text-indigo-brand transition-colors">Institutional Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-on-surface-variant/70">
          <div>
            © 2026 GenuAI Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Inter &amp; Space Grotesk Typography</span>
            <span>•</span>
            <span>Mobile-First Tailwind CSS</span>
            <span>•</span>
            <span>OAuth Single Sign-On</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
