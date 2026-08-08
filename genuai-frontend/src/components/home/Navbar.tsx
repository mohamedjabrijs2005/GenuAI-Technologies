import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onGetStarted?: () => void;
}

export const Navbar: React.FC<Props> = ({ onGetStarted }) => {
  const navigate = useNavigate();
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

  const handleGetStartedClick = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/auth');
    }
  };

  const navLinks = [
    { label: 'Experience', href: '#about' },
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'Innovation', href: '#core-usp' },
    { label: 'Candidates', href: '#candidates' },
    { label: 'Companies', href: '#companies' },
    { label: 'Learning Hub', href: '#learning-hub' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-xl border-b border-surface-container shadow-md py-3'
          : 'bg-surface/75 backdrop-blur-md border-b border-surface-container/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Prominent Title - Clean root link */}
          <a
            href="/"
            onClick={scrollToTop}
            className="flex items-center gap-3 group shrink-0 cursor-pointer"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="GenuAI Technologies Logo"
                className="w-9 sm:w-10 h-9 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute -inset-1 bg-accent-gold/20 blur-md rounded-full -z-10 group-hover:bg-indigo-brand/30 transition-all" />
            </div>
            <div>
              <div className="font-black text-lg sm:text-xl tracking-tight text-on-surface flex items-center gap-1.5 leading-none">
                <span>Genu<span className="text-accent-gold">AI</span> Technologies</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20">
                  Platform
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
                AI Recruitment Intelligence
              </div>
            </div>
          </a>

          {/* Center Nav Links on Desktop */}
          <div className="hidden xl:flex items-center gap-4.5 2xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-on-surface-variant hover:text-indigo-brand transition-colors whitespace-nowrap cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action on Desktop (xl and above) */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <button
              onClick={handleGetStartedClick}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark hover:shadow-lg hover:shadow-indigo-brand/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile & Tablet Action (below xl) - exactly ONE button and toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={handleGetStartedClick}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <span>Get Started</span>
            </button>
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
        <div className="xl:hidden border-b border-surface-container bg-surface/98 backdrop-blur-2xl px-4 pt-3 pb-6 shadow-2xl animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
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
