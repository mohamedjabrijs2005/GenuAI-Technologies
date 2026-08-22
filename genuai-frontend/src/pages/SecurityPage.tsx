import React from 'react';
import { ShieldCheck, Cpu, Eye, Fingerprint, Lock, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SecurityPage() {
  const navigate = useNavigate();

  const layers = [
    { num: '01', name: 'Biometric Face Recognition', desc: 'Continuous facial landmark tracking confirming identity consistency throughout testing.' },
    { num: '02', name: 'Voice Timbre & Frequency Match', desc: 'Acoustic waveform analysis ensuring the registered candidate remains the sole speaker.' },
    { num: '03', name: 'Gaze & Attention Tracking', desc: 'Detects off-screen gaze patterns and secondary monitor usage.' },
    { num: '04', name: 'Secondary Person Detection', desc: 'Computer vision alerts when a secondary individual enters the camera field.' },
    { num: '05', name: 'Audio Whispering & Audio Feed Analysis', desc: 'Background speech detection to prevent real-time prompter assistance.' },
    { num: '06', name: 'Browser Tab & Focus Monitoring', desc: 'Log-based events for window blurring, tab switching, and developer tool toggles.' },
    { num: '07', name: 'Paste & Clipboard Tamper Detection', desc: 'Monitors raw clipboard interactions during code compiler execution.' },
    { num: '08', name: 'Algorithmic Code Typing Telemetry', desc: 'Keystroke dynamics and typing cadence analysis to catch external auto-complete bots.' },
    { num: '09', name: 'Mobile Device Screen Reflection Check', desc: 'Reflective optical analysis detecting phone screens held near the camera.' },
    { num: '10', name: 'Cryptographic Scorecard Signature', desc: 'All score outputs are cryptographically signed to prevent scorecard tampering.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Home</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anti-Proxy Security Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Security &amp; Trust Center
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Multi-Signal Fusion AI proctoring, multi-layer verification, and evidentiary fraud detection for fair candidate evaluation.
          </p>
        </div>

        {/* AI Trust Score Explanation Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="text-4xl font-black text-emerald-600 mb-1 font-mono">94%</div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Trust Score Index</div>
            <p className="text-[11px] text-slate-500 mt-2 font-normal">Evidentiary standard for recruiter verification</p>
          </div>

          <div className="md:col-span-8 space-y-3 text-xs text-slate-600 leading-relaxed font-normal">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Multi-Signal Fusion Methodology</h3>
            <p>
              The GenuAI Trust Index combines biometric face landmarks, voice timbre matching, gaze tracking, and environment telemetry into a unified evidentiary rating.
            </p>
            <p>
              GenuAI explicitly designates the AI Trust Score as an evidentiary tool to assist human decision-making, rather than a 100% infallible automated disqualification system.
            </p>
          </div>
        </div>

        {/* 10 Verification Layers Grid */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>10 Synchronized Verification Layers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {layers.map((l) => (
              <div key={l.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600">{l.num}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{l.name}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

