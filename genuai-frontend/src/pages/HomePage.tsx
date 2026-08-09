import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { About } from '../components/home/About';
import { Problem } from '../components/home/Problem';
import { Solution } from '../components/home/Solution';
import { CoreUSP } from '../components/home/CoreUSP';
import { WhyCompanies } from '../components/home/WhyCompanies';
import { AssessmentWorkflow } from '../components/home/AssessmentWorkflow';
import { TrustVerification } from '../components/home/TrustVerification';
import { TrustScore } from '../components/home/TrustScore';
import { SoftwareInnovation } from '../components/home/SoftwareInnovation';
import { CandidateSection } from '../components/home/CandidateSection';
import { CompanySection } from '../components/home/CompanySection';
import { AdminSection } from '../components/home/AdminSection';
import { LearningHub } from '../components/home/LearningHub';
import { RecruitmentIntelligence } from '../components/home/RecruitmentIntelligence';
import { Comparison } from '../components/home/Comparison';
import { TechStack } from '../components/home/TechStack';
import { WhyGenuAI } from '../components/home/WhyGenuAI';
import { Roadmap } from '../components/home/Roadmap';
import { SubscriptionPricing } from '../components/home/SubscriptionPricing';
import { ContactForm } from '../components/home/ContactForm';
import { TermsAndConditions } from '../components/home/TermsAndConditions';
import { VideoSection } from '../components/home/VideoSection';
import { FounderSection } from '../components/home/FounderSection';
import { FinalCTA } from '../components/home/FinalCTA';
import { Footer } from '../components/home/Footer';
import { LoginRequiredModal, ProtectedActionConfig } from '../components/home/LoginRequiredModal';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for Login Required Modal over Home Page
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    config: ProtectedActionConfig | null;
  }>({
    isOpen: false,
    config: null,
  });

  // Main primary entry point: GET STARTED directly enters /auth without intermediate modal
  const handleGetStarted = () => {
    navigate('/auth');
  };

  // Smooth scroll explore without route changes
  const handleExplore = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle hash navigation (e.g. #terms-and-conditions) on mount or hash change
  React.useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash || (window.location.href.includes('#') ? '#' + window.location.href.split('#')[1] : '');
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  // Protected actions on the Home Page
  const handleProtectedAction = (config: ProtectedActionConfig) => {
    // 1. Check if user is already authenticated with real verified session
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

    // 2. Not logged in: Show Login Required Modal OVER Home Page, preserving scroll position
    setModalState({
      isOpen: true,
      config,
    });
  };

  // Modal Login / Register clicked -> Navigate to /auth with intent
  const handleLoginRegisterFromModal = (intent?: string) => {
    setModalState({ isOpen: false, config: null });
    if (intent) {
      navigate(`/auth?intent=${encodeURIComponent(intent)}`);
    } else {
      navigate('/auth');
    }
  };

  // Modal Continue Exploring clicked -> Close modal, remain on Home Page at current scroll
  const handleCloseModal = () => {
    setModalState({ isOpen: false, config: null });
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base antialiased selection:bg-indigo-brand selection:text-white">
      {/* 1. Fixed Glassmorphism Navbar with direct Get Started */}
      <Navbar onGetStarted={handleGetStarted} />

      <main>
        {/* 2. Hero Section with Animated AI Recruitment Visual */}
        <Hero
          onGetStarted={handleGetStarted}
          onExplore={handleExplore}
          onProtectedAction={handleProtectedAction}
        />

        {/* 3. About GenuAI Section (Candidate, Company, GenuAI Ecosystem Cards) */}
        <About onProtectedAction={handleProtectedAction} />

        {/* 4. The Problem Section */}
        <Problem />

        {/* 5. GenuAI Solution Section */}
        <Solution />

        {/* 6. Core USP: One Assessment -> Multiple Companies */}
        <CoreUSP onProtectedAction={handleProtectedAction} />

        {/* 7. Why Companies Need GenuAI */}
        <WhyCompanies onProtectedAction={handleProtectedAction} />

        {/* 8. 10-Step Assessment Workflow Ecosystem */}
        <AssessmentWorkflow onProtectedAction={handleProtectedAction} />

        {/* 9. AI Anti-Proxy System (Multi-Modal AI Verification) */}
        <TrustVerification onProtectedAction={handleProtectedAction} />

        {/* 10. AI Trust Score & Verification Dashboard */}
        <TrustScore onProtectedAction={handleProtectedAction} />

        {/* 11. AI-Powered Recruitment Intelligence (Software Innovation) */}
        <SoftwareInnovation onProtectedAction={handleProtectedAction} />

        {/* 12. Candidate Experience */}
        <CandidateSection onProtectedAction={handleProtectedAction} />

        {/* 13. Company Experience */}
        <CompanySection onProtectedAction={handleProtectedAction} />

        {/* 14. Admin & Institution Experience */}
        <AdminSection onProtectedAction={handleProtectedAction} />

        {/* 15. Intensive Learning Hub & Multilingual Vision */}
        <LearningHub onProtectedAction={handleProtectedAction} />

        {/* 16. Recruitment Intelligence & Analytics */}
        <RecruitmentIntelligence onProtectedAction={handleProtectedAction} />

        {/* 17. Traditional vs GenuAI Comparison */}
        <Comparison />

        {/* 18. Technology Stack (Pure Software Stack) */}
        <TechStack />

        {/* 19. Why GenuAI (5 Core Value Pillars) */}
        <WhyGenuAI />

        {/* 20. Subscription / Pricing Section */}
        <SubscriptionPricing onProtectedAction={handleProtectedAction} />

        {/* 21. Future Roadmap */}
        <Roadmap />

        {/* 22. Send a Message / Public Contact Form */}
        <ContactForm />

        {/* 23. Complete Terms & Conditions (Single Source Anchor: id="terms-and-conditions") */}
        <TermsAndConditions />

        {/* 24. See GenuAI in Action YouTube Video Section */}
        <VideoSection />

        {/* 25. Founder Details & Leadership Vision */}
        <FounderSection />

        {/* 26. Final Call to Action */}
        <FinalCTA onGetStarted={handleGetStarted} onExplore={handleExplore} />
      </main>

      {/* 27. Footer */}
      <Footer />

      {/* 28. Login Required Modal Overlay */}
      <LoginRequiredModal
        isOpen={modalState.isOpen}
        config={modalState.config}
        onClose={handleCloseModal}
        onLoginRegister={handleLoginRegisterFromModal}
      />
    </div>
  );
}
