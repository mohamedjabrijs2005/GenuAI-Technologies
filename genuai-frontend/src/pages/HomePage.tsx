import React from 'react';
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
import { EdgeAI } from '../components/home/EdgeAI';
import { CandidateSection } from '../components/home/CandidateSection';
import { CompanySection } from '../components/home/CompanySection';
import { AdminSection } from '../components/home/AdminSection';
import { LearningHub } from '../components/home/LearningHub';
import { RecruitmentIntelligence } from '../components/home/RecruitmentIntelligence';
import { Comparison } from '../components/home/Comparison';
import { TechStack } from '../components/home/TechStack';
import { WhyGenuAI } from '../components/home/WhyGenuAI';
import { Roadmap } from '../components/home/Roadmap';
import { ContactForm } from '../components/home/ContactForm';
import { FinalCTA } from '../components/home/FinalCTA';
import { Footer } from '../components/home/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleExplore = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base antialiased selection:bg-indigo-brand selection:text-white">
      {/* 1. Transparent Fixed Glassmorphism Navbar */}
      <Navbar onGetStarted={handleGetStarted} />

      <main>
        {/* 2. Hero Section with Animated AI Recruitment Visual */}
        <Hero onGetStarted={handleGetStarted} onExplore={handleExplore} />

        {/* 3. About GenuAI Section */}
        <About />

        {/* 4. The Problem Section */}
        <Problem />

        {/* 5. GenuAI Solution Section */}
        <Solution />

        {/* 6. Core USP: One Assessment -> Multiple Companies */}
        <CoreUSP />

        {/* 7. Why Companies Need GenuAI */}
        <WhyCompanies />

        {/* 8. 10-Step Assessment Workflow Ecosystem */}
        <AssessmentWorkflow />

        {/* 9. AI Anti-Proxy System */}
        <TrustVerification />

        {/* 10. AI Trust Score & Verification Dashboard */}
        <TrustScore />

        {/* 11. Edge AI Hardware Innovation (Raspberry Pi 5 + Google Coral TPU) */}
        <EdgeAI />

        {/* 12. Candidate Experience */}
        <CandidateSection />

        {/* 13. Company Experience */}
        <CompanySection />

        {/* 14. Admin & Institution Experience */}
        <AdminSection />

        {/* 15. Intensive Learning Hub & Multilingual Vision */}
        <LearningHub />

        {/* 16. Recruitment Intelligence Pipeline */}
        <RecruitmentIntelligence />

        {/* 17. Traditional vs GenuAI Comparison */}
        <Comparison />

        {/* 18. Technology Stack */}
        <TechStack />

        {/* 19. Why GenuAI (5 Core Pillars) */}
        <WhyGenuAI />

        {/* 20. Future Roadmap */}
        <Roadmap />

        {/* 21. Send a Message / Public Contact Form */}
        <ContactForm />

        {/* 22. Final Call to Action */}
        <FinalCTA onGetStarted={handleGetStarted} onExplore={handleExplore} />
      </main>

      {/* 23. Footer */}
      <Footer />
    </div>
  );
}
