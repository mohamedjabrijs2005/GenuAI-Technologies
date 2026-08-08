import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const navLinks = [
    { label: 'Home', href: '/', onClick: scrollToTop },
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'One Assessment', href: '#core-usp' },
    { label: 'Candidates', href: '#candidates' },
    { label: 'Companies', href: '#companies' },
    { label: 'Terms & Policies', href: '#terms' },
    { label: 'Contact', href: '#contact' },
    { label: 'Demo', href: '#demo-video' },
    { label: 'Founder', href: '#founder' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-xl border-b border-surface-container shadow-md py-3'
          : 'bg-surface/75 backdrop-blur-md border-b border-surface-container/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Prominent Title - Clean root link */}
          <a
            href="/"
            onClick={scrollToTop}
            className="flex items-center gap-3.5 group shrink-0 cursor-pointer"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="GenuAI Technologies Logo"
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute -inset-1 bg-accent-gold/20 blur-md rounded-full -z-10 group-hover:bg-indigo-brand/30 transition-all" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-on-surface flex items-center gap-1.5 leading-none">
                <span>Genu<span className="text-accent-gold">AI</span> Technologies</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20">
                  Platform
                </span>
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
                AI-Powered Recruitment Intelligence
              </div>
            </div>
          </a>

          {/* Center Nav Links on Desktop */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className="text-xs font-semibold text-on-surface-variant hover:text-indigo-brand transition-colors whitespace-nowrap cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-on-surface hover:bg-surface-bright border border-surface-container transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-surface-container bg-surface/98 backdrop-blur-2xl px-4 pt-3 pb-6 shadow-2xl animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.onClick) link.onClick(e);
                }}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-on-surface hover:bg-indigo-brand/10 hover:text-indigo-brand transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
