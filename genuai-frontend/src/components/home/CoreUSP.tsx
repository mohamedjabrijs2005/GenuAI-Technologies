import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Building, Briefcase, Zap, Star } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const CoreUSP: React.FC<Props> = ({ onProtectedAction }) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['Google', 'Microsoft', 'Amazon']);

  const sampleCompanies = [
    { name: 'Google', openRoles: '3 Vacancies', badge: 'Tier 1' },
    { name: 'Microsoft', openRoles: '2 Vacancies', badge: 'Tier 1' },
    { name: 'Amazon', openRoles: '4 Vacancies', badge: 'Tier 1' },
    { name: 'Zoho', openRoles: '5 Vacancies', badge: 'Product' },
    { name: 'Accenture', openRoles: '6 Vacancies', badge: 'Enterprise' },
    { name: 'Cognizant', openRoles: '3 Vacancies', badge: 'Global' },
  ];

  const toggleCompany = (name: string) => {
    if (selectedCompanies.includes(name)) {
      if (selectedCompanies.length > 1) {
        setSelectedCompanies(selectedCompanies.filter((c) => c !== name));
      }
    } else {
      setSelectedCompanies([...selectedCompanies, name]);
    }
  };

  const handleStartUnifiedTest = () => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: 'Ready to start your Unified Assessment?',
        description: `Take one rigorous, AI-verified assessment and dispatch your standardized credentials to ${selectedCompanies.join(', ')}.`,
      });
    }
  };

  return (
    <section id="core-usp" className="py-12 sm:py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Visual Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-indigo-brand/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-accent-gold/15 text-accent-gold-dark text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-accent-gold/30">
            <Star className="w-3.5 h-3.5" />
            <span>The Primary Innovation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            One Assessment → <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-brand via-[#7C3AED] to-accent-gold">
              Multiple Companies
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            "Your skills should travel with you." Take one rigorous, AI-verified assessment and securely share your standardized credentials across your chosen target organizations.
          </p>
        </div>

        {/* Interactive 4-Step Interactive Simulation Card */}
        <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-surface-container shadow-xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-indigo-brand uppercase tracking-widest bg-indigo-brand/10 px-3 py-1 rounded-full border border-indigo-brand/20">
              Interactive Workflow Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-surface-bright border border-surface-container flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-brand uppercase mb-2">Step 01</div>
                <h3 className="text-base font-bold text-on-surface mb-2">Select Target Companies</h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Candidates choose their interested employers before beginning.
                </p>
                <div className="space-y-1.5">
                  {sampleCompanies.map((c) => {
                    const isSelected = selectedCompanies.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        onClick={() => toggleCompany(c.name)}
                        className={`w-full p-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-brand/10 border-indigo-brand text-indigo-brand'
                            : 'bg-surface border-surface-container text-on-surface-variant hover:border-surface-container-high'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5" />
                          {c.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-brand" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Dynamic Assessment Journey */}
            <div
              onClick={handleStartUnifiedTest}
              className="p-6 rounded-2xl bg-surface-bright border border-indigo-brand/30 flex flex-col justify-between shadow-xs cursor-pointer hover:border-indigo-500 active:scale-[0.98] transition-all"
            >
              <div>
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Step 02</div>
                <h3 className="text-base font-bold text-on-surface mb-2">Dynamic Assessment Path</h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Hit "I'm Ready" and GenuAI Works generates your path — Core, Majority, and Company-Specific modules, with "Why am I taking this?" explanations.
                </p>
                <div className="p-4 rounded-xl bg-surface border border-surface-container space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>Core Requirements (100% Shared)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>Majority Skills (&gt;50% Common)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>Company-Specific Modules</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>Verified Result Reuse</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                <span>Generate Your Path</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={handleStartUnifiedTest}
              className="p-6 rounded-2xl bg-surface-bright border border-success/30 flex flex-col justify-between shadow-xs cursor-pointer hover:border-success transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-success-dark uppercase mb-2">Step 03</div>
                <h3 className="text-base font-bold text-on-surface mb-2">AI Verified Performance</h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Multi-modal anti-proxy algorithms verify identity, voice, and environment integrity.
                </p>
                <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                  <div className="text-3xl font-black text-success mb-1">94%</div>
                  <div className="text-xs font-bold text-on-surface uppercase tracking-wider">AI Trust Score</div>
                  <div className="text-[10px] text-on-surface-variant mt-1">Tamper-Proof Verification</div>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-bold text-success-dark flex items-center gap-1">
                <span>Verify Trust Score</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-surface-bright border border-surface-container flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-accent-gold-dark uppercase mb-2">Step 04</div>
                <h3 className="text-base font-bold text-on-surface mb-2">Shared With {selectedCompanies.length} Companies</h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Standardized results are delivered directly to chosen company HR dashboards.
                </p>
                <div className="space-y-2 mb-4">
                  {selectedCompanies.map((comp) => (
                    <div key={comp} className="p-2 rounded-xl bg-surface border border-surface-container flex items-center justify-between text-xs font-bold text-on-surface">
                      <span>{comp}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success-dark">Dispatched ✓</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleStartUnifiedTest}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-brand hover:bg-indigo-brand-dark text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Dispatch Verified Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="mt-8 pt-6 border-t border-surface-container grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-on-surface-variant">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-brand shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface block">For Candidates:</strong>
                Zero repeated test fatigue. One effort translates to verified consideration across multiple dream employers.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface block">For Companies:</strong>
                Instantly access verified, proctored assessment data without building custom testing infrastructure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
