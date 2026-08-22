import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { About } from '../components/home/About';
import { Problem } from '../components/home/Problem';
import { Solution } from '../components/home/Solution';
import { CoreUSP } from '../components/home/CoreUSP';
import { WhyCompanies } from '../components/home/WhyCompanies';
import { ContactForm } from '../components/home/ContactForm';
import { FinalCTA } from '../components/home/FinalCTA';
import { Footer } from '../components/home/Footer';
import { LoginRequiredModal, ProtectedActionConfig } from '../components/home/LoginRequiredModal';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, CheckCircle2, FileText, Lock, Zap, Sparkles, Cpu, BookOpen } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    config: ProtectedActionConfig | null;
  }>({
    isOpen: false,
    config: null,
  });

  const handleGetStarted = () => {
    navigate('/terms');
  };

  const handleExplore = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProtectedAction = (config: ProtectedActionConfig) => {
    if (user) {
      const role = user.role;
      if (config.intent === 'company' || role === 'company') {
        navigate('/company');
        return;
      }
      if (config.intent === 'admin' || config.intent === 'genuai' || role === 'admin') {
        navigate('/admin');
        return;
      }
      navigate('/dashboard');
      return;
    }

    setModalState({
      isOpen: true,
      config,
    });
  };

  const handleLoginRegisterFromModal = (intent?: string) => {
    setModalState({ isOpen: false, config: null });
    if (intent) {
      navigate(`/auth?intent=${encodeURIComponent(intent)}`);
    } else {
      navigate('/auth');
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, config: null });
  };

  const orientationSteps = [
    { step: '01', title: 'Terms & Conditions', path: '/terms', icon: FileText },
    { step: '02', title: 'Privacy Policy', path: '/privacy', icon: Lock },
    { step: '03', title: 'Ecosystem Pricing', path: '/pricing', icon: Zap },
    { step: '04', title: 'Product Roadmap', path: '/roadmap', icon: Sparkles },
    { step: '05', title: 'Security Center', path: '/security', icon: ShieldCheck },
    { step: '06', title: 'Learning Hub', path: '/learning-hub', icon: BookOpen },
    { step: '07', title: 'Technology Stack', path: '/technology', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base antialiased selection:bg-indigo-brand selection:text-white">
      {/* Navbar */}
      <Navbar onGetStarted={handleGetStarted} />

      <main>
        {/* Hero Section */}
        <Hero
          onGetStarted={handleGetStarted}
          onExplore={handleExplore}
          onProtectedAction={handleProtectedAction}
        />

        {/* Guided 7-Step Orientation Callout Banner */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sequential Platform Orientation</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    7-Step Guided Policy &amp; Platform Tour
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-normal">
                    Review each reference module sequentially, confirm consent checkboxes, and proceed seamlessly to login.
                  </p>
                </div>

                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Start Step 1: Terms &amp; Conditions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 7 Steps Horizontal Timeline Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-4 border-t border-slate-800">
                {orientationSteps.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.step}
                      onClick={() => navigate(s.path)}
                      className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-left space-y-2 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-400">
                        <span>Step {s.step}</span>
                        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {s.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* About GenuAI Section */}
        <About onProtectedAction={handleProtectedAction} />

        {/* Problem Section */}
        <Problem />

        {/* Solution Section */}
        <Solution />

        {/* Core USP */}
        <CoreUSP onProtectedAction={handleProtectedAction} />

        {/* Why Companies Need GenuAI */}
        <WhyCompanies onProtectedAction={handleProtectedAction} />

        {/* Public Contact Form */}
        <ContactForm />

        {/* Final CTA */}
        <FinalCTA onGetStarted={handleGetStarted} onExplore={handleExplore} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Required Modal Overlay */}
      <LoginRequiredModal
        isOpen={modalState.isOpen}
        config={modalState.config}
        onClose={handleCloseModal}
        onLoginRegister={handleLoginRegisterFromModal}
      />
    </div>
  );
}

