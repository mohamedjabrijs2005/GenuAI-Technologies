import React, { useState } from 'react';
import { FileText, Award, Code, Mic, Users, Video, FolderGit2, Fingerprint, Eye, BarChart3, CheckCircle } from 'lucide-react';

export const AssessmentWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Resume Analysis',
      desc: 'AI parsing extracts core competencies, verifies ATS match percentage, and cross-references experience claims.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Aptitude Assessment',
      desc: 'Adaptive quantitative and logical reasoning engine calibrated to candidate seniority level.',
      icon: Award,
    },
    {
      num: '03',
      title: 'Coding Assessment',
      desc: 'Real-time proctored code execution supporting multiple languages with algorithmic efficiency scoring.',
      icon: Code,
    },
    {
      num: '04',
      title: 'Communication Evaluation',
      desc: 'SVAR verbal assessment measures spoken English, pronunciation, listening comprehension, and fluency.',
      icon: Mic,
    },
    {
      num: '05',
      title: 'Group Discussion',
      desc: 'AI-moderated collaborative debate evaluating active listening, leadership, and structured problem-solving.',
      icon: Users,
    },
    {
      num: '06',
      title: 'AI Interview',
      desc: 'Proctored live technical interview with dynamic question adaptation and speech emotion analysis.',
      icon: Video,
    },
    {
      num: '07',
      title: 'Real-Time Project Assessment',
      desc: 'Hands-on project challenge requiring real code commits, architectural design, and bug fixing.',
      icon: FolderGit2,
    },
    {
      num: '08',
      title: 'Identity Verification',
      desc: 'Continuous biometric face recognition and voice consistency checking to prevent proxy impersonation.',
      icon: Fingerprint,
    },
    {
      num: '09',
      title: 'Environment Verification',
      desc: 'Live multi-person detection, mobile phone detection, tab-switching monitoring, and gaze tracking.',
      icon: Eye,
    },
    {
      num: '10',
      title: 'Recruitment Intelligence',
      desc: 'Comprehensive multi-dimensional hiring scorecard shared securely with participating employers.',
      icon: BarChart3,
    },
  ];

  return (
    <section id="workflow" className="py-20 sm:py-24 lg:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-brand/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>End-to-End Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            Complete Assessment Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            "One platform. Complete assessment intelligence." Ten synchronized evaluation stages working together to build an authentic candidate profile.
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
                className={`glass rounded-3xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
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
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-surface-bright border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-brand text-white flex items-center justify-center font-black text-lg">
              {steps[activeStep].num}
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider">Stage {steps[activeStep].num} Selected</div>
              <div className="text-base font-bold text-on-surface">{steps[activeStep].title}</div>
              <div className="text-xs text-on-surface-variant">{steps[activeStep].desc}</div>
            </div>
          </div>
          <span className="text-xs font-bold px-4 py-2 rounded-xl bg-surface border border-surface-container text-on-surface">
            Standardized Across All Companies
          </span>
        </div>
      </div>
    </section>
  );
};
