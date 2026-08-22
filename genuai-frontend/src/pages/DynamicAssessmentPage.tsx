import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSavedSelections,
  generateDynamicPath,
  DynamicPathData,
  CompanyRoleSelectionItem,
  ModuleRequirementItem,
} from '../services/genuaiWorksService';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export default function DynamicAssessmentPage({ user, onBack }: { user?: any; onBack?: () => void }) {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<CompanyRoleSelectionItem[]>([]);
  const [pathData, setPathData] = useState<DynamicPathData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeWhyModal, setActiveWhyModal] = useState<string | null>(null);

  useEffect(() => {
    const saved = getSavedSelections();
    if (saved.length === 0) {
      // Default fallback selections if candidate hasn't chosen yet
      const defaultSel: CompanyRoleSelectionItem[] = [
        { companyId: 101, companyName: 'Zoho', roleTitle: 'Sales Executive' },
        { companyId: 102, companyName: 'Apple', roleTitle: 'Sales Executive' },
        { companyId: 103, companyName: 'Google', roleTitle: 'Data Analyst' },
      ];
      setSelections(defaultSel);
    } else {
      setSelections(saved);
    }
  }, []);

  const handleGeneratePath = async () => {
    setLoading(true);
    try {
      const data = await generateDynamicPath(user?.id || 1, selections);
      setPathData(data);
    } catch (err: any) {
      alert('Failed to generate path: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> GenuAI Works Engine
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dynamic Assessment Journey</h1>
            </div>
          </div>

          <button
            onClick={() => navigate('/companies')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 transition"
          >
            Edit Selections
          </button>
        </div>

        {/* Selected Companies Header Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Selected Targets</span>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {selections.map((sel, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-slate-900 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-white"
                  >
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    {sel.companyName}
                    <span className="text-slate-500">→</span>
                    <span className="text-purple-300 font-medium">{sel.roleTitle}</span>
                  </span>
                ))}
              </div>
            </div>

            {!pathData && (
              <button
                onClick={handleGeneratePath}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition transform active:scale-95 text-base uppercase tracking-wider"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white" /> I'M READY
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Generated Assessment Path View */}
        {pathData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Banner: Path Ready */}
            <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Assessment Journey Orchestrated Successfully
                </div>
                <p className="text-slate-300 text-sm">
                  Your personalized assessment path has been dynamically generated by aggregating your target company requirements.
                </p>
              </div>

              <button
                onClick={() => navigate('/matches')}
                className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-md"
              >
                <span>View Company Matches</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reused Results Banner (Rule §23) */}
            {pathData.reusedResults && pathData.reusedResults.length > 0 && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                  <ShieldCheck className="w-5 h-5" /> Verified Assessment Reuse Applied
                </div>
                <div className="space-y-2">
                  {pathData.reusedResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-emerald-500/20 text-xs">
                      <div className="font-semibold text-emerald-300">{r.canonicalName}</div>
                      <div className="text-slate-400">{r.reason}</div>
                      <div className="font-mono font-bold text-emerald-400 text-sm">{r.percentage}% VERIFIED</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role Groups & Modules */}
            {pathData.roleGroups.map((group, gIdx) => (
              <div key={gIdx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div>
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Role Context #{gIdx + 1}</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{group.canonicalRoleName.replace(/_/g, ' ')}</h2>
                  </div>
                  <div className="text-xs text-slate-400">
                    Companies: {group.selections.map((s) => s.companyName).join(', ')}
                  </div>
                </div>

                {/* Core Modules (100% common) */}
                {group.coreModules.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Core Requirements (Common to All Selected Companies)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.coreModules.map((mod) => (
                        <ModuleCard
                          key={mod.canonicalName}
                          module={mod}
                          explanation={pathData.explanations[mod.canonicalName]}
                          onWhyClick={() => setActiveWhyModal(mod.canonicalName)}
                          badgeColor="bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Majority Modules (>50% common) */}
                {group.majorityModules.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Majority Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.majorityModules.map((mod) => (
                        <ModuleCard
                          key={mod.canonicalName}
                          module={mod}
                          explanation={pathData.explanations[mod.canonicalName]}
                          onWhyClick={() => setActiveWhyModal(mod.canonicalName)}
                          badgeColor="bg-indigo-500/10 border-indigo-500/40 text-indigo-400"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Company-Specific Modules (<50%) */}
                {group.companySpecificModules.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> Company-Specific Requirements (Preserved)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.companySpecificModules.map((mod) => (
                        <ModuleCard
                          key={mod.canonicalName}
                          module={mod}
                          explanation={pathData.explanations[mod.canonicalName]}
                          onWhyClick={() => setActiveWhyModal(mod.canonicalName)}
                          badgeColor="bg-amber-500/10 border-amber-500/40 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleGeneratePath}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4" /> Regenerate Assessment Path
              </button>

              <button
                onClick={() => navigate('/amcat')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
              >
                <Play className="w-4 h-4 fill-white" /> Start Assessment Path
              </button>
            </div>
          </div>
        )}

        {/* "Why Am I Taking This?" Explanation Modal */}
        {activeWhyModal && pathData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <HelpCircle className="w-5 h-5" /> Why Am I Taking This?
              </div>
              <h3 className="text-xl font-bold text-white">{activeWhyModal.replace(/_/g, ' ')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {pathData.explanations[activeWhyModal] || 'Required by your selected company configurations.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveWhyModal(null)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition text-sm"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleCard({
  module,
  explanation,
  onWhyClick,
  badgeColor,
}: {
  module: ModuleRequirementItem;
  explanation?: string;
  onWhyClick: () => void;
  badgeColor: string;
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-white text-base">{module.name}</h4>
          <button
            onClick={onWhyClick}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md transition font-medium"
            title="Why am I taking this?"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Why?
          </button>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2">{explanation}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className={`px-2.5 py-1 rounded-lg border font-semibold ${badgeColor}`}>
          {module.companyNames.join(', ')}
        </span>
        <span className="text-slate-500 font-mono">
          {module.frequency}/{module.totalCompanies} Companies
        </span>
      </div>
    </div>
  );
}
