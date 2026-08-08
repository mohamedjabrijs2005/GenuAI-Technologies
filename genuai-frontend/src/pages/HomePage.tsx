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
import { CandidateSection } from '../components/home/CandidateSection';
import { CompanySection } from '../components/home/CompanySection';
import { AdminSection } from '../components/home/AdminSection';
import { LearningHub } from '../components/home/LearningHub';
import { RecruitmentIntelligence } from '../components/home/RecruitmentIntelligence';
import { Comparison } from '../components/home/Comparison';
import { TermsAndConditions } from '../components/home/TermsAndConditions';
import { WhyGenuAI } from '../components/home/WhyGenuAI';
import { Roadmap } from '../components/home/Roadmap';
import { ContactForm } from '../components/home/ContactForm';
import { VideoSection } from '../components/home/VideoSection';
import { FounderSection } from '../components/home/FounderSection';
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
      {/* 1. Fixed Glassmorphism Navbar */}
      <Navbar />

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

        {/* 11. Candidate Experience */}
        <CandidateSection />

        {/* 12. Company Experience */}
        <CompanySection />

        {/* 13. Admin & Institution Experience */}
        <AdminSection />

        {/* 14. Intensive Learning Hub & Multilingual Vision */}
        <LearningHub />

        {/* 15. Recruitment Intelligence Pipeline */}
        <RecruitmentIntelligence />

        {/* 16. Traditional vs GenuAI Comparison */}
        <Comparison />

        {/* 17. Complete Terms & Conditions Applied Concepts */}
        <TermsAndConditions />

        {/* 18. Why GenuAI (5 Core Pillars) */}
        <WhyGenuAI />

        {/* 19. Future Roadmap */}
        <Roadmap />

        {/* 20. Send a Message / Public Contact Form */}
        <ContactForm />

        {/* 21. See GenuAI in Action YouTube Video Section (Placed at the end) */}
        <VideoSection />

        {/* 22. Founder Details & Leadership Vision (Placed at the end) */}
        <FounderSection />

        {/* 23. Final Call to Action */}
        <FinalCTA onGetStarted={handleGetStarted} onExplore={handleExplore} />
      </main>

      {/* 24. Footer */}
      <Footer />
    </div>
  );
}
