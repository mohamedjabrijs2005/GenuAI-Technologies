import React, { useState } from 'react';
import { FileText, Award, Code, Mic, Users, Video, FolderGit2, Fingerprint, Eye, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const AssessmentWorkflow: React.FC<Props> = ({ onProtectedAction }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Select Companies & Roles',
      desc: 'Choose your target companies (Zoho, Apple, Google) and roles to initiate requirement aggregation.',
      icon: Users,
    },
    {
      num: '02',
      title: 'Explore & Practice',
      desc: 'Build confidence with AI mock interviews, practice coding, and domain question banks.',
      icon: Code,
    },
    {
      num: '03',
      title: 'Click "I\'m Ready"',
      desc: 'Trigger GenuAI Works engine to generate your personalized, role-aware assessment path.',
      icon: CheckCircle,
    },
    {
      num: '04',
      title: 'Dynamic Assessment Path',
      desc: 'Complete Core, Majority, and Company-Specific modules with clear "Why am I taking this?" explanations.',
      icon: FileText,
    },
    {
      num: '05',
      title: 'Explainable Match Scores',
      desc: 'Receive transparent match scores per company, broken down by weighted skill contribution.',
      icon: BarChart3,
    },
  ];

  const handleStartStage = (stepTitle: string) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: 'Ready to take this Assessment Stage?',
        description: `Sign in or create an account to start ${stepTitle} and build your verified talent scorecard.`,
      });
    }
  };

  return (
    <section id="workflow" className="py-12 sm:py-16 lg:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Candidate Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            How Your Journey Works
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            From target company selection to role-aware assessment orchestration and explainable match scores in 5 clear steps.
          </p>
        </div>

        {/* 10-Step Interactive Grid / Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(idx)}
                className={`glass rounded-3xl p-5 sm:p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-brand ring-2 ring-indigo-brand/30 bg-indigo-brand/5 shadow-md -translate-y-1'
                    : 'border-surface-container hover:border-surface-container-high hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-bright text-indigo-brand border border-surface-container">
                      {s.num}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-indigo-brand text-white' : 'bg-surface-container/50 text-on-surface-variant'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-on-surface mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container/50 text-[10px] font-bold text-indigo-brand">
                  {isActive ? '● Active Module' : 'Click to inspect'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Stage Highlight Box */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-8 rounded-3xl bg-surface-bright border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-brand text-white flex items-center justify-center font-black text-lg shrink-0">
              {steps[activeStep].num}
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider">Stage {steps[activeStep].num} Selected</div>
              <div className="text-base font-bold text-on-surface">{steps[activeStep].title}</div>
              <div className="text-xs text-on-surface-variant">{steps[activeStep].desc}</div>
            </div>
          </div>
          <button
            onClick={() => handleStartStage(steps[activeStep].title)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-brand hover:bg-indigo-brand-dark text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Start Stage {steps[activeStep].num}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
