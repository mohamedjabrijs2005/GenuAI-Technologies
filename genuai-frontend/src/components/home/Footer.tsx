import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-surface-container py-16 text-on-surface-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GenuAI" className="w-8 h-8 object-contain" onError={(e) => ((e.target as HTMLElement).style.display = 'none')} />
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
              <li><a href="#about" className="hover:text-indigo-brand transition-colors">What is GenuAI?</a></li>
              <li><a href="#problem" className="hover:text-indigo-brand transition-colors">The Problem</a></li>
              <li><a href="#solution" className="hover:text-indigo-brand transition-colors">Our Solution</a></li>
              <li><a href="#terms" className="hover:text-indigo-brand transition-colors">Terms &amp; Policies</a></li>
            </ul>
          </div>

          {/* Col 3: Audiences */}
          <div>
            <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Audiences</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#candidates" className="hover:text-indigo-brand transition-colors">Candidate Hub</a></li>
              <li><a href="#companies" className="hover:text-indigo-brand transition-colors">Company Access</a></li>
              <li><a href="#admin" className="hover:text-indigo-brand transition-colors">Institutional Admin</a></li>
              <li><a href="#learning-hub" className="hover:text-indigo-brand transition-colors">Learning Hub</a></li>
              <li><a href="#contact" className="hover:text-indigo-brand transition-colors">Send Message</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-on-surface-variant/70">
          <div>
            © {new Date().getFullYear()} GenuAI Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Inter &amp; Space Grotesk Typography</span>
            <span>•</span>
            <span>Mobile-First Tailwind CSS</span>
            <span>•</span>
            <span>OAuth Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
