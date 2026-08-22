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
      sessionStorage.setItem('genuai_target_intent', intent);
    }
    navigate('/terms');
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, config: null });
  };



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

