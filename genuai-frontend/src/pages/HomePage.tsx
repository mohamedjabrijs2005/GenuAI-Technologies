import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { FounderSection } from '../components/home/FounderSection';
import { VideoSection } from '../components/home/VideoSection';
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

        {/* 3. Founder Details Section */}
        <FounderSection />

        {/* 4. See GenuAI in Action YouTube Video Section */}
        <VideoSection />

        {/* 5. About GenuAI Section */}
        <About />

        {/* 6. The Problem Section */}
        <Problem />

        {/* 7. GenuAI Solution Section */}
        <Solution />

        {/* 8. Core USP: One Assessment -> Multiple Companies */}
        <CoreUSP />

        {/* 9. Why Companies Need GenuAI */}
        <WhyCompanies />

        {/* 10. 10-Step Assessment Workflow Ecosystem */}
        <AssessmentWorkflow />

        {/* 11. AI Anti-Proxy System */}
        <TrustVerification />

        {/* 12. AI Trust Score & Verification Dashboard */}
        <TrustScore />

        {/* 13. Edge AI Hardware Innovation (Raspberry Pi 5 + Google Coral TPU) */}
        <EdgeAI />

        {/* 14. Candidate Experience */}
        <CandidateSection />

        {/* 15. Company Experience */}
        <CompanySection />

        {/* 16. Admin & Institution Experience */}
        <AdminSection />

        {/* 17. Intensive Learning Hub & Multilingual Vision */}
        <LearningHub />

        {/* 18. Recruitment Intelligence Pipeline */}
        <RecruitmentIntelligence />

        {/* 19. Traditional vs GenuAI Comparison */}
        <Comparison />

        {/* 20. Technology Stack */}
        <TechStack />

        {/* 21. Why GenuAI (5 Core Pillars) */}
        <WhyGenuAI />

        {/* 22. Future Roadmap */}
        <Roadmap />

        {/* 23. Send a Message / Public Contact Form */}
        <ContactForm />

        {/* 24. Final Call to Action */}
        <FinalCTA onGetStarted={handleGetStarted} onExplore={handleExplore} />
      </main>

      {/* 25. Footer */}
      <Footer />
    </div>
  );
}
