import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

export const Navbar: React.FC<Props> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Experience', href: '#hero' },
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'One Assessment', href: '#core-usp' },
    { label: 'Innovation', href: '#edge-ai' },
    { label: 'Candidates', href: '#candidates' },
    { label: 'Companies', href: '#companies' },
    { label: 'Learning Hub', href: '#learning-hub' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-sm py-3'
          : 'bg-surface/60 backdrop-blur-md border-b border-surface-container/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="GenuAI Technologies"
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute -inset-1 bg-indigo-brand/20 blur-md rounded-full -z-10 group-hover:bg-indigo-brand/30 transition-all" />
            </div>
            <div>
              <div className="font-bold text-lg text-on-surface tracking-tight flex items-center gap-1.5">
                <span>Genu<span className="text-indigo-brand">AI</span></span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20">
                  Platform
                </span>
              </div>
              <div className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Recruitment Intelligence
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-on-surface-variant hover:text-indigo-brand transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark hover:shadow-lg hover:shadow-indigo-brand/30 transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-indigo-brand focus-visible:ring-offset-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-on-surface hover:bg-surface-bright border border-surface-container transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-surface-container bg-surface/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-indigo-brand/10 hover:text-indigo-brand transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-surface-container">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark flex items-center justify-center gap-2 shadow-md"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
