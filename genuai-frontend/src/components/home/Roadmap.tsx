import React from 'react';
import { Compass, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const roadmapItems = [
    { stage: 'Phase 01', title: 'Interactive Web Prototype & Assessment Hub', status: 'Completed • Live', desc: 'Core 7-module assessment platform, ATS parser, coding IDE, and automated grading.', active: true },
    { stage: 'Phase 02', title: 'AI Verification & Biometric Proctoring Engine', status: 'Completed • Live', desc: 'Face recognition, voice baseline matching, continuous gaze tracking, and AI Trust scoring.', active: true },
    { stage: 'Phase 03', title: 'Edge AI Assessment Unit Hardware Prototype', status: 'In Active R&D', desc: 'Raspberry Pi 5 + Google Coral TPU local neural inference pipeline integration.', active: false },
    { stage: 'Phase 04', title: 'University & Pilot Campus Deployments', status: 'Q3 2026', desc: 'Placement cell trials across engineering institutions to validate multi-company distribution.', active: false },
    { stage: 'Phase 05', title: 'Corporate Enterprise Partnerships', status: 'Q4 2026', desc: 'Direct ATS integration with top tier tech companies and automated candidate dispatch.', active: false },
    { stage: 'Phase 06', title: 'Multilingual Learning Hub Expansion', status: 'Roadmap 2027', desc: 'Native audio coaching & assessment delivery across Tamil, Hindi, Japanese, and Chinese.', active: false },
    { stage: 'Phase 07', title: 'Global Scalable Recruitment Infrastructure', status: 'Future Horizon', desc: 'Standardized international skill accreditation protocol with cryptographic verification.', active: false },
  ];

  return (
    <section id="roadmap" className="py-20 sm:py-24 lg:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Strategic Horizon</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Where GenuAI Is Going
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            From our current working prototype to global enterprise edge deployment, we clearly delineate our active milestones from future innovations.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {roadmapItems.map((item, i) => (
            <div
              key={item.stage}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                item.active
                  ? 'bg-surface-bright border-indigo-brand/40 shadow-xs'
                  : 'bg-surface border-surface-container opacity-85'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  item.active ? 'bg-success text-white' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {item.active ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-indigo-brand">{item.stage}</span>
                    <span className="text-on-surface-variant/40">•</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.active ? 'bg-success/10 text-success-dark' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
