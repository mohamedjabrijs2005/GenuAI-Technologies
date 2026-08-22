import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              AI-Powered Recruitment Intelligence Ecosystem. Transforming hiring through multi-modal assessment, anti-proxy verification, and intelligent talent distribution.
            </p>
            <div className="text-xs font-semibold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Target Companies • Dynamic Paths • Verified Talent</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Ecosystem</div>
            <ul className="space-y-2 text-xs">
              <li><Link to="/pricing" className="hover:text-indigo-500 transition-colors">Pricing</Link></li>
              <li><Link to="/learning-hub" className="hover:text-indigo-500 transition-colors">Learning Hub</Link></li>
              <li><Link to="/roadmap" className="hover:text-indigo-500 transition-colors">Roadmap</Link></li>
              <li><Link to="/security" className="hover:text-indigo-500 transition-colors">Security Center</Link></li>
              <li><Link to="/agreements" className="hover:text-indigo-500 transition-colors">Role Agreements</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div>
            <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Governance</div>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/companies" className="hover:text-indigo-500 transition-colors">Target Companies</Link></li>
              <li><Link to="/readiness" className="hover:text-indigo-500 transition-colors">Candidate Readiness</Link></li>
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
