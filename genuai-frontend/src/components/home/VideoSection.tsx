import React from 'react';
import { PlayCircle, Sparkles } from 'lucide-react';

export const VideoSection: React.FC = () => {
  return (
    <section id="demo-video" className="py-12 sm:py-16 lg:py-24 bg-background quantum-gradient relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Ecosystem Demonstration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-on-surface mb-3 sm:mb-4 leading-tight tracking-tight">
            See GenuAI in Action
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Watch how our 6-dimension AI evaluation and multi-company assessment architecture transforms the recruitment lifecycle.
          </p>
        </div>

        {/* Embedded Video Box */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-indigo-brand via-accent-gold to-[#7C3AED] rounded-2xl sm:rounded-[2.5rem] blur-lg sm:blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />
          <div className="relative glass p-2 sm:p-4 rounded-2xl sm:rounded-[2.2rem] overflow-hidden shadow-2xl border border-surface-container/80">
            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-surface-bright flex items-center justify-center shadow-inner">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/hBfLOl41IwI?autoplay=0&controls=1&rel=0"
                title="GenuAI Technologies Ecosystem Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
