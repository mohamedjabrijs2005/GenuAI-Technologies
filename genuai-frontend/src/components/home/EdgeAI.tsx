import React from 'react';
import { Cpu, Wifi, HardDrive, Shield, Zap, Lock, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

export const EdgeAI: React.FC = () => {
  const benefits = [
    { title: 'Lower Bandwidth', desc: 'Eliminates continuous 1080p video streaming; transmits only periodic verification tokens and alert payloads.', icon: Wifi },
    { title: 'Faster Local Inference', desc: 'Sub-millisecond on-device computer vision execution via tensor processing units.', icon: Zap },
    { title: 'Enhanced Privacy', desc: 'Raw biometric feeds are processed locally on the hardware unit rather than stored indefinitely on cloud servers.', icon: Lock },
    { title: 'Reduced Cloud Dependency', desc: 'Tests continue uninterrupted even through temporary network latency drops or packet loss.', icon: HardDrive },
    { title: 'Scalable Infrastructure', desc: 'Thousands of simultaneous assessments run with minimal centralized server loads.', icon: RefreshCw },
    { title: 'Modular Hardware', desc: 'Standard USB plug-and-play accelerator hardware compatible with existing lab workstations.', icon: Cpu },
  ];

  return (
    <section id="edge-ai" className="py-20 sm:py-24 lg:py-32 bg-surface-bright/50 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware Innovation • Prototype Concept</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
            GenuAI Edge AI Assessment Unit
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            "Selected AI verification and computer-vision tasks can be processed locally at the edge rather than continuously transmitting raw video to the cloud."
          </p>
          <div className="mt-4 inline-block text-[11px] font-bold text-on-surface-variant bg-surface px-3 py-1 rounded-full border border-surface-container">
            Planned &amp; Prototyped Hardware Architecture • In Active R&amp;D
          </div>
        </div>

        {/* Hardware Architecture Visual Flow */}
        <div className="glass rounded-3xl p-8 sm:p-12 border border-surface-container shadow-xl mb-16">
          <div className="text-xs font-bold text-indigo-brand uppercase tracking-widest text-center mb-8">
            Edge Compute Pipeline &amp; Data Flow
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-surface border border-surface-container text-center">
              <div className="text-2xl mb-2">📷 🎙️</div>
              <div className="text-xs font-bold text-on-surface">Camera + Mic</div>
              <div className="text-[10px] text-on-surface-variant mt-1">Raw Video/Audio Feeds</div>
            </div>

            <div className="hidden md:flex justify-center text-indigo-brand font-bold">→</div>

            {/* Step 2: Edge Unit */}
            <div className="p-5 rounded-2xl bg-indigo-brand/10 border border-indigo-brand/30 text-center shadow-xs">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-brand text-white flex items-center justify-center font-bold mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-indigo-brand">GenuAI Edge Unit</div>
              <div className="text-[10px] text-on-surface-variant mt-1 font-mono">Raspberry Pi 5 + Google Coral TPU</div>
            </div>

            <div className="hidden md:flex justify-center text-indigo-brand font-bold">→</div>

            {/* Step 3: Local AI */}
            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center shadow-xs">
              <div className="text-2xl mb-2">⚡ 🧠</div>
              <div className="text-xs font-bold text-purple-700">Local AI Processing</div>
              <div className="text-[10px] text-on-surface-variant mt-1">Face • Voice • Liveness • Gaze</div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-on-surface font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span>Transmits: Verification Alerts • AI Trust Score • Structured Metadata</span>
            </div>
            <div className="text-indigo-brand font-bold bg-indigo-brand/10 px-3 py-1 rounded-full border border-indigo-brand/20">
              To GenuAI Cloud Backend
            </div>
          </div>
        </div>

        {/* 6 Key Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="glass rounded-3xl p-6 border border-surface-container shadow-xs hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-on-surface mb-2">{b.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Clarification Notice */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-container flex items-start gap-3 max-w-3xl mx-auto text-xs text-on-surface-variant">
          <AlertCircle className="w-4 h-4 text-indigo-brand shrink-0 mt-0.5" />
          <span>
            <strong>Architectural Note:</strong> The GenuAI Edge AI system is designed to minimize unnecessary continuous cloud video transmission while maintaining rich cryptographic audit trails for recruiter compliance.
          </span>
        </div>
      </div>
    </section>
  );
};
