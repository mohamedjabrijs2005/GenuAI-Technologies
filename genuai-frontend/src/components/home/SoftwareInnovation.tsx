import React from 'react';
import { Sparkles, BrainCircuit, ShieldCheck, BarChart3, Repeat, ArrowRight } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const SoftwareInnovation: React.FC<Props> = ({ onProtectedAction }) => {
  const innovations = [
    {
      num: '01',
      title: 'AI Assessment Intelligence',
      desc: 'Adaptive and role-based assessment experiences tailored dynamically to specific job criteria and skill levels.',
      icon: BrainCircuit,
      accent: {
        iconBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        cardBorder: 'border-indigo-100 hover:border-indigo-300',
      },
    },
    {
      num: '02',
      title: 'Multi-Modal AI Verification',
      desc: 'Face, voice, liveness and environment-based verification concepts utilizing standard browser cameras and microphones.',
      icon: ShieldCheck,
      accent: {
        iconBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20',
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        cardBorder: 'border-cyan-100 hover:border-cyan-300',
      },
    },
    {
      num: '03',
      title: 'Recruitment Intelligence',
      desc: 'AI-powered analysis of candidate performance and hiring signals, transforming raw test telemetry into actionable scorecards.',
      icon: BarChart3,
      accent: {
        iconBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/20',
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        cardBorder: 'border-purple-100 hover:border-purple-300',
      },
    },
    {
      num: '04',
      title: 'One Assessment → Multiple Companies',
      desc: 'A reusable verified assessment experience designed to reduce repetitive recruitment processes across participating employers.',
      icon: Repeat,
      accent: {
        iconBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cardBorder: 'border-emerald-100 hover:border-emerald-300',
      },
    },
  ];

  const handleCardClick = (title: string) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: 'candidate',
        title: `Explore ${title}`,
        description: `Sign in or create an account to experience GenuAI's ${title} capabilities in action.`,
      });
    }
  };

  return (
    <section id="ai-innovation" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Software Innovation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            AI-Powered Recruitment Intelligence
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            GenuAI combines multiple AI capabilities to create a unified, intelligent recruitment ecosystem that helps evaluate skills, verify assessment authenticity, and support data-driven hiring.
          </p>
        </div>

        {/* 4 Software Innovation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {innovations.map((item) => {
            const Icon = item.icon;
            const { iconBg, badge, cardBorder } = item.accent;

            return (
              <div
                key={item.num}
                onClick={() => handleCardClick(item.title)}
                className={`glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:-translate-y-1 ${cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${badge}`}>
                      {item.num}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
