import React from 'react';
import { ShieldAlert, UserCheck, Mic, Eye, Smartphone, Users, HelpCircle, Activity, Camera, AlertCircle } from 'lucide-react';

export const TrustVerification: React.FC = () => {
  const layers = [
    { title: 'Face Recognition', desc: 'Continuous match against registered profile photo', icon: Camera },
    { title: 'Voice Recognition', desc: 'Acoustic voiceprint baseline & speaker verification', icon: Mic },
    { title: 'Face Liveness Detection', desc: 'Passive texture & micro-motion anti-spoofing', icon: UserCheck },
    { title: 'Continuous Identity Verification', desc: 'Frame-by-frame persistent candidate confirmation', icon: Activity },
    { title: 'Multiple Person Detection', desc: 'Flags unauthorized third parties in camera frame', icon: Users },
    { title: 'Mobile Phone Detection', desc: 'Object detection for smartphone screen reflections', icon: Smartphone },
    { title: 'Suspicious Object Detection', desc: 'Monitors external gadgets, headsets, and notes', icon: ShieldAlert },
    { title: 'Eye / Gaze Analysis', desc: 'Off-screen eye direction & reading pattern detection', icon: Eye },
    { title: 'Head Pose Analysis', desc: 'Calculates pitch, yaw, and roll orientation angles', icon: Activity },
    { title: 'AI-Assisted Cheating Detection', desc: 'Identifies LLM-generated speech cadence & tab switches', icon: HelpCircle },
  ];

  return (
    <section id="anti-proxy" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Anti-Proxy Security Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Can We Trust the Candidate Behind the Screen?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Remote recruitment cannot rely on simple honesty. GenuAI deploys multi-layered computer vision and audio biometric verification to establish verified authenticity.
          </p>
        </div>

        {/* 10 Verification Layers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.title}
                className="glass rounded-3xl p-5 border border-surface-container shadow-xs hover:border-indigo-brand/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-brand/10 text-indigo-brand flex items-center justify-center mb-4 group-hover:bg-indigo-brand group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface mb-1.5 leading-snug">
                  {layer.title}
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {layer.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Equation Banner & Disclaimer */}
        <div className="glass-gold rounded-3xl p-6 sm:p-8 border border-accent-gold/40 shadow-sm">
          <div className="text-center mb-4">
            <span className="text-xs font-black text-on-surface uppercase tracking-widest">
              Multi-Modal Authenticity Principle
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-on-surface text-center mb-6">
            <span className="px-3 py-1 rounded-xl bg-surface border border-surface-container">Face</span>
            <span className="text-indigo-brand">+</span>
            <span className="px-3 py-1 rounded-xl bg-surface border border-surface-container">Voice</span>
            <span className="text-indigo-brand">+</span>
            <span className="px-3 py-1 rounded-xl bg-surface border border-surface-container">Liveness</span>
            <span className="text-indigo-brand">+</span>
            <span className="px-3 py-1 rounded-xl bg-surface border border-surface-container">Behaviour</span>
            <span className="text-indigo-brand">+</span>
            <span className="px-3 py-1 rounded-xl bg-surface border border-surface-container">Environment</span>
            <span className="text-success">=</span>
            <span className="px-3 py-1 rounded-xl bg-success text-white">Stronger Candidate Authenticity</span>
          </div>

          {/* Ethical Disclaimer */}
          <div className="flex items-start gap-2 max-w-2xl mx-auto p-3 rounded-2xl bg-surface/80 border border-surface-container text-[11px] text-on-surface-variant">
            <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Notice:</strong> GenuAI provides an AI-generated verification indicator assisting human recruiters. It is not designed as a 100% infallible fraud detection guarantee, but as an advanced evidentiary support system.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
