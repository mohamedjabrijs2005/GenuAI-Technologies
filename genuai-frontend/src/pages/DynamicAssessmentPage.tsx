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
  X,
  Layers,
  Award,
  Check,
} from 'lucide-react';
import { GenuAILogo } from '../components/common/GenuAILogo';

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
        { companyId: 101, companyName: 'Google', roleTitle: 'Software Engineer' },
        { companyId: 102, companyName: 'Microsoft', roleTitle: 'Full Stack Software Engineer' },
        { companyId: 105, companyName: 'Zoho Corporation', roleTitle: 'Software Developer' },
      ];
      setSelections(defaultSel);
    } else {
      setSelections(saved);
    }
  }, []);

  const handleGeneratePath = async () => {
    if (!user?.id) {
      alert('Please log in to generate your assessment path.');
      return;
    }
    setLoading(true);
    try {
      const data = await generateDynamicPath(user.id, selections);
      setPathData(data);
    } catch (err: any) {
      alert('Failed to generate path: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body-base antialiased pb-20 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/candidate-path')}
                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Back to Paths"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <GenuAILogo size="sm" showText={true} />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200/80">
              <Sparkles className="w-3.5 h-3.5" />
              Step 2 of 3: Dynamic Orchestration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              Edit Targets
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Page Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            GenuAI Works Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dynamic Assessment Journey
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Consolidates overlapping module requirements across all your target employers into an anti-redundant, single testing session.
          </p>
        </div>

        {/* Selected Companies Header Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">
                  Configured Target Employers ({selections.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 mt-3">
                {selections.map((sel, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-200 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <strong className="text-slate-900">{sel.companyName}</strong>
                    <span className="text-slate-400 font-normal">→</span>
                    <span className="text-blue-700 font-medium">{sel.roleTitle}</span>
                  </span>
                ))}
              </div>
            </div>

            {!pathData && (
              <button
                type="button"
                onClick={handleGeneratePath}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-7 py-3.5 rounded-xl shadow-sm transition-all transform active:scale-98 text-sm uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Launch Dynamic Path</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Generated Assessment Path View */}
        {pathData && (
          <div className="space-y-8">
            {/* Banner: Path Ready */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                    Assessment Journey Orchestrated Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                    Requirements cross-calibrated. Take tests once to update match scores across all selected companies simultaneously.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/matches')}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 border border-emerald-300 font-bold px-4 py-2 rounded-xl text-xs transition shadow-2xs cursor-pointer shrink-0"
              >
                <span>View Company Matches</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reused Results Banner */}
            {pathData.reusedResults && pathData.reusedResults.length > 0 && (
              <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Module Score Reuse Applied</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pathData.reusedResults.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 text-xs"
                    >
                      <div>
                        <div className="font-bold text-emerald-950">{r.canonicalName}</div>
                        <div className="text-[11px] text-emerald-700 mt-0.5">{r.reason}</div>
                      </div>
                      <div className="font-mono font-black text-emerald-700 text-sm pl-2">
                        {r.percentage}% VERIFIED
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role Groups & Modules */}
            {pathData.roleGroups.map((group, gIdx) => (
              <div key={gIdx} className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <span className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                      Role Group #{gIdx + 1}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {group.canonicalRoleName.replace(/_/g, ' ')}
                    </h2>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Companies: <strong className="text-slate-800">{group.selections.map((s) => s.companyName).join(', ')}</strong>
                  </div>
                </div>

                {/* Core Modules (100% common) */}
                {group.coreModules.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-emerald-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Core Requirements (Common to All Target Companies)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.coreModules.map((mod) => (
                        <ModuleCard
                          key={mod.canonicalName}
                          module={mod}
                          explanation={pathData.explanations[mod.canonicalName]}
                          onWhyClick={() => setActiveWhyModal(mod.canonicalName)}
                          badgeClass="bg-emerald-50 text-emerald-800 border-emerald-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Majority Modules (>50% common) */}
                {group.majorityModules.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-blue-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>Majority Requirements (Required by &gt;50% of Companies)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.majorityModules.map((mod) => (
                        <ModuleCard
                          key={mod.canonicalName}
                          module={mod}
                          explanation={pathData.explanations[mod.canonicalName]}
                          onWhyClick={() => setActiveWhyModal(mod.canonicalName)}
                          badgeClass="bg-blue-50 text-blue-800 border-blue-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Company-Specific Modules (<50%) */}
                {group.companySpecificModules.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-amber-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      <span>Company-Specific Requirements (Preserved)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.companySpecificModules.map((mod) => (
                        <ModuleCard
                          key={mod.canonicalName}
                          module={mod}
                          explanation={pathData.explanations[mod.canonicalName]}
                          onWhyClick={() => setActiveWhyModal(mod.canonicalName)}
                          badgeClass="bg-amber-50 text-amber-800 border-amber-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleGeneratePath}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-calibrate Assessment Path</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/amcat')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-xs transition cursor-pointer text-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Assessment Path</span>
              </button>
            </div>
          </div>
        )}

        {/* "Why Am I Taking This?" Explanation Modal */}
        {activeWhyModal && pathData && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-scaleIn">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Module Requirement Rationale</h3>
                    <p className="text-xs text-slate-500">{activeWhyModal}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWhyModal(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {pathData.explanations[activeWhyModal] ||
                  `This module is required by your selected employers to evaluate core competencies in ${activeWhyModal}.`}
              </div>

              <button
                type="button"
                onClick={() => setActiveWhyModal(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ModuleCard({
  module,
  explanation,
  onWhyClick,
  badgeClass,
}: {
  module: ModuleRequirementItem;
  explanation?: string;
  onWhyClick: () => void;
  badgeClass: string;
}) {
  return (
    <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between hover:bg-white hover:shadow-xs transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-sm text-slate-900 leading-snug">{module.name}</h4>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${badgeClass}`}>
            Weight: {Math.round(module.weight * 100)}%
          </span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2">
          Required by:{' '}
          <strong className="text-slate-700">{module.companyNames.join(', ')}</strong> ({module.frequency}/
          {module.totalCompanies} companies)
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400 capitalize">{module.category}</span>
        <button
          type="button"
          onClick={onWhyClick}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Why this module?</span>
        </button>
      </div>
    </div>
  );
}
