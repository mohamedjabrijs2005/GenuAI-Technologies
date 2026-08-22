import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, X, ChevronRight, FileText } from 'lucide-react';
import { lockCompanyRoleConfig, requestConfigChange, getSubscriptionPlans } from '../../services/genuaiWorksService';

interface Props {
  roleId: number;
  roleTitle: string;
  isLocked?: boolean;
  versionNumber?: number;
  selectedModuleIds?: number[];
  onClose: () => void;
  onSuccess?: () => void;
}

const AVAILABLE_MODULES = [
  { id: 1, name: 'GenuAI Skill Test', category: 'core', desc: 'Standardized core skill & aptitude assessment (AMCAT-style)' },
  { id: 2, name: 'Proctored Coding IDE', category: 'technical', desc: 'Multi-language algorithmic challenge with time & space complexity scoring' },
  { id: 3, name: 'DSA & System Design', category: 'technical', desc: 'Data structures, algorithm optimization, and architecture challenge' },
  { id: 4, name: 'SVAR Verbal Communication', category: 'communication', desc: 'AI speech analysis measuring spoken fluency, pronunciation & vocabulary' },
  { id: 5, name: 'Group Discussion', category: 'soft_skill', desc: 'AI-moderated collaborative debate evaluating active listening & leadership' },
  { id: 6, name: 'AI Technical Interview', category: 'interview', desc: 'Proctored live adaptive technical Q&A with emotion & gaze analysis' },
  { id: 7, name: 'Quantitative Aptitude', category: 'aptitude', desc: 'Adaptive mathematical reasoning & problem solving' },
  { id: 8, name: 'Logical Reasoning', category: 'aptitude', desc: 'Pattern identification, analytical & deductive logic' },
  { id: 9, name: 'SQL & Data Analysis', category: 'data', desc: 'Hands-on query execution & dataset manipulation' },
  { id: 10, name: 'Hands-on Git Project', category: 'technical', desc: 'Real-world repository commit challenge with architectural code review' },
];

export const CompanyRoleConfigModal: React.FC<Props> = ({
  roleId,
  roleTitle,
  isLocked = false,
  versionNumber = 1,
  selectedModuleIds: initialSelected = [1, 2, 4, 6],
  onClose,
  onSuccess,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected);
  const [agreed, setAgreed] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [changeReason, setChangeReason] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [lockedState, setLockedState] = useState(isLocked);

  const toggleModule = (id: number) => {
    if (lockedState) return;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((mId) => mId !== id));
    } else {
      if (selectedIds.length >= 6) {
        setError('Maximum 6 requirements allowed per role configuration.');
        return;
      }
      setError('');
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleProceedToAgreement = () => {
    if (selectedIds.length < 4 || selectedIds.length > 6) {
      setError(`Please select between 4 and 6 assessment requirements. You have selected ${selectedIds.length}.`);
      return;
    }
    setError('');
    setShowAgreementModal(true);
  };

  const handleLockConfiguration = async () => {
    if (!agreed) {
      setError('You must review and accept the agreement before locking.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await lockCompanyRoleConfig(roleId, selectedIds, agreed);
      if (res.success) {
        setLockedState(true);
        setShowAgreementModal(false);
        setSuccessMsg(`Configuration successfully LOCKED as Version ${res.versionId || 1}.`);
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Failed to lock configuration.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error locking configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChangeRequest = async () => {
    setLoading(true);
    try {
      const p = await getSubscriptionPlans();
      setPlans(p);
      if (p.length > 0) setSelectedPlanId(p[0].id);
      setShowChangeRequestModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChangeRequest = async () => {
    if (!changeReason.trim()) {
      setError('Please enter a reason for the configuration change request.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await requestConfigChange(roleId, changeReason, selectedPlanId || undefined);
      setSuccessMsg('Configuration change request submitted successfully to admin review.');
      setShowChangeRequestModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error submitting change request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{roleTitle}</h2>
              {lockedState ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked V{versionNumber}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Draft Config
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select 4 to 6 assessment requirements. Confirmed configurations are locked for candidate evaluation consistency.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Selected Count Indicator */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-6 text-xs">
          <span className="text-slate-300 font-semibold">Requirement Count (Rule §10):</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded ${selectedIds.length >= 4 && selectedIds.length <= 6 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {selectedIds.length} / 6 Selected (Min 4 Required)
          </span>
        </div>

        {/* Module Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 mb-6">
          {AVAILABLE_MODULES.map((mod) => {
            const isSelected = selectedIds.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`p-3.5 rounded-2xl border transition-all select-none ${
                  lockedState
                    ? isSelected
                      ? 'bg-slate-800/90 border-slate-600 opacity-90'
                      : 'bg-slate-900 border-slate-800 opacity-40'
                    : isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white cursor-pointer shadow-xs'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {mod.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{mod.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          {lockedState ? (
            <button
              onClick={handleOpenChangeRequest}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>Request Configuration Change (V2)</span>
            </button>
          ) : (
            <button
              onClick={handleProceedToAgreement}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Review Agreement &amp; Lock Config</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AGREEMENT MODAL (Rule §11) */}
        {showAgreementModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 text-indigo-400">
                <FileText className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold text-white">Assessment Configuration Agreement</h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  I confirm that the selected <strong>{selectedIds.length} assessment requirements</strong> accurately represent the role expectations for <strong>{roleTitle}</strong>.
                </p>
                <p>
                  I understand that GenuAI Works will merge these requirements with other company selections to build dynamic candidate assessment paths.
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
                  ⚠️ After confirmation, this configuration will be <strong>LOCKED (V1)</strong>. Direct edits will be disabled to preserve candidate match integrity. Future edits require an active subscription plan.
                </div>
              </div>

              <div
                onClick={() => setAgreed(!agreed)}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 cursor-pointer accent-indigo-600 shrink-0"
                />
                <label className="text-xs text-slate-300 leading-relaxed cursor-pointer font-medium">
                  I have reviewed and accept the GenuAI Assessment Configuration Agreement terms.
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAgreementModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleLockConfiguration}
                  disabled={loading || !agreed}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Locking...' : 'Sign Agreement & Lock Configuration'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHANGE REQUEST MODAL (Rule §14, §15) */}
        {showChangeRequestModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 text-amber-400">
                <Sparkles className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold text-white">Request Configuration Change</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Modifying a locked configuration creates a new version (V2) upon admin review and approval. Select an active subscription plan to proceed.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">Reason for Change *</label>
                <textarea
                  rows={3}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="e.g. Updated role requirements to include system design and coding evaluation."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">Select Subscription Plan</label>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        selectedPlanId === p.id ? 'bg-amber-500/15 border-amber-500 text-white' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.description}</div>
                      </div>
                      <div className="font-mono text-xs font-bold text-amber-400">
                        ₹{p.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowChangeRequestModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitChangeRequest}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
