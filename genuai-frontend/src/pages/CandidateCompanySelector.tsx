import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAvailableCompanies,
  saveCandidateSelections,
  getSavedSelections,
  CompanyOption,
  CompanyRoleSelectionItem,
} from '../services/genuaiWorksService';
import { Building2, CheckCircle2, ChevronRight, Sparkles, Briefcase, ArrowLeft } from 'lucide-react';

export default function CandidateCompanySelector({ user, onBack }: { user?: any; onBack?: () => void }) {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Record<number, CompanyRoleSelectionItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const coList = await getAvailableCompanies();
      setCompanies(coList);

      const saved = getSavedSelections();
      const initialMap: Record<number, CompanyRoleSelectionItem> = {};

      if (saved.length > 0) {
        for (const item of saved) {
          initialMap[item.companyId] = item;
        }
      } else {
        // Pre-select Zoho (Sales Executive) & Apple (Software Engineer) as initial demo selection
        const zoho = coList.find((c) => c.companyName.toLowerCase().includes('zoho'));
        const apple = coList.find((c) => c.companyName.toLowerCase().includes('apple'));

        if (zoho && zoho.roles.length > 0) {
          initialMap[zoho.id] = {
            companyId: zoho.id,
            companyName: zoho.companyName,
            companyRoleId: zoho.roles[0].id,
            roleTitle: zoho.roles[0].title,
          };
        }
        if (apple && apple.roles.length > 0) {
          initialMap[apple.id] = {
            companyId: apple.id,
            companyName: apple.companyName,
            companyRoleId: apple.roles[0].id,
            roleTitle: apple.roles[0].title,
          };
        }
      }

      setSelectedCompanies(initialMap);
      setLoading(false);
    }

    loadData();
  }, []);

  const toggleCompany = (company: CompanyOption) => {
    setSelectedCompanies((prev) => {
      const next = { ...prev };
      if (next[company.id]) {
        delete next[company.id];
      } else {
        const defaultRole = company.roles[0] || { id: 1, title: 'Software Engineer' };
        next[company.id] = {
          companyId: company.id,
          companyName: company.companyName,
          companyRoleId: defaultRole.id,
          roleTitle: defaultRole.title,
        };
      }
      return next;
    });
  };

  const selectRoleForCompany = (company: CompanyOption, roleTitle: string, roleId?: number) => {
    setSelectedCompanies((prev) => ({
      ...prev,
      [company.id]: {
        companyId: company.id,
        companyName: company.companyName,
        companyRoleId: roleId,
        roleTitle,
      },
    }));
  };

  const handleProceedToReady = async () => {
    const selectionList = Object.values(selectedCompanies);
    if (selectionList.length === 0) {
      alert('Please select at least one company and role.');
      return;
    }

    await saveCandidateSelections(user?.id || 1, selectionList);
    navigate('/my-assessment');
  };

  const selectionCount = Object.keys(selectedCompanies).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
              {onBack && (
                <button onClick={onBack} className="p-1 hover:bg-slate-800 rounded-md transition mr-1">
                  <ArrowLeft className="w-4 h-4 text-slate-300" />
                </button>
              )}
              <Sparkles className="w-4 h-4" /> GENUAI WORKS — STEP 1
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Target Companies & Roles</h1>
            <p className="text-slate-400 text-sm mt-1">
              Select multiple companies and your desired roles. GenuAI Works will orchestrate your role-aware dynamic assessment.
            </p>
          </div>

          <button
            onClick={handleProceedToReady}
            disabled={selectionCount === 0}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95"
          >
            <span>Proceed to "I'm Ready" ({selectionCount} Selected)</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Summary Chips */}
        {selectionCount > 0 && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-inner">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Your Target Selections</h3>
            <div className="flex flex-wrap gap-3">
              {Object.values(selectedCompanies).map((item) => (
                <div
                  key={item.companyId}
                  className="flex items-center gap-2 bg-slate-900/90 border border-indigo-500/40 px-3.5 py-2 rounded-xl text-sm font-medium text-white shadow-sm"
                >
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold">{item.companyName}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-purple-300 font-semibold">{item.roleTitle}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Companies Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companies.map((co) => {
              const isSelected = !!selectedCompanies[co.id];
              const currentRole = selectedCompanies[co.id]?.roleTitle || co.roles[0]?.title;

              return (
                <div
                  key={co.id}
                  className={`relative rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center font-bold text-xl text-indigo-300 border border-slate-600">
                          {co.companyName[0]}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{co.companyName}</h2>
                          <p className="text-xs text-slate-400">{co.industry} • {co.location}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCompany(co)}
                        className={`p-2 rounded-lg transition ${
                          isSelected ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-6 h-6 ${isSelected ? 'fill-indigo-500 text-slate-900' : ''}`} />
                      </button>
                    </div>

                    {/* Role selector dropdown/chips */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <label className="text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> Select Target Role
                      </label>
                      <div className="space-y-2">
                        {co.roles.map((r) => {
                          const isRoleActive = isSelected && currentRole === r.title;
                          return (
                            <button
                              key={r.id}
                              onClick={() => {
                                if (!isSelected) toggleCompany(co);
                                selectRoleForCompany(co, r.title, r.id);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                                isRoleActive
                                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                                  : 'bg-slate-900/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/40'
                              }`}
                            >
                              <span>{r.title}</span>
                              <span className="text-xs opacity-75 font-mono">v{r.version} Locked</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
