import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAvailableCompanies,
  saveCandidateSelections,
  getSavedSelections,
  clearSavedSelections,
  CompanyOption,
  CompanyRoleSelectionItem,
} from '../services/genuaiWorksService';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Briefcase,
  ArrowLeft,
  Search,
  Check,
  X,
  ShieldCheck,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { GenuAILogo } from '../components/common/GenuAILogo';

export default function CandidateCompanySelector({ user, onBack }: { user?: any; onBack?: () => void }) {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Record<number, CompanyRoleSelectionItem>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
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
      }

      setSelectedCompanies(initialMap);
      setLoading(false);
    }

    loadData();
  }, []);

  const industries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry) {
        c.industry.split('&').forEach((part) => set.add(part.trim()));
      }
    });
    return ['all', ...Array.from(set)];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roles.some((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesIndustry =
        selectedIndustry === 'all' || (c.industry && c.industry.toLowerCase().includes(selectedIndustry.toLowerCase()));
      return matchesSearch && matchesIndustry;
    });
  }, [companies, searchQuery, selectedIndustry]);

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

  const removeSelection = (companyId: number) => {
    setSelectedCompanies((prev) => {
      const next = { ...prev };
      delete next[companyId];
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

  const handleClearAll = async () => {
    setSelectedCompanies({});
    await clearSavedSelections(user?.id || 1);
  };

  const handleProceedToReady = async () => {
    const selectionList = Object.values(selectedCompanies);
    if (selectionList.length === 0) {
      alert('Please select at least one company and target role to proceed.');
      return;
    }

    await saveCandidateSelections(user?.id || 1, selectionList);
    navigate('/my-assessment');
  };

  const selectionCount = Object.keys(selectedCompanies).length;

  const companyColorPalette = [
    { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-600' },
    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-600' },
    { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-600' },
    { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
    { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-600' },
    { bg: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body-base antialiased pb-20 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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

          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200/80">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1 of 3: Target Configuration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleProceedToReady}
              disabled={selectionCount === 0}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-sm transition-all transform active:scale-98 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Proceed to Assessment ({selectionCount})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Page Hero Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Enterprise Employer Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Target Companies &amp; Desired Roles
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Choose the companies you wish to be evaluated for. GenuAI Works will aggregate and cross-calibrate their specific requirements into a single, unified dynamic assessment.
          </p>
        </div>

        {/* Selected Targets Sticky Summary Bar */}
        {selectionCount > 0 && (
          <div className="bg-white border border-blue-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Active Selected Targets ({selectionCount} Selected)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {Object.values(selectedCompanies).map((item) => (
                <div
                  key={item.companyId}
                  className="inline-flex items-center gap-2 bg-blue-50/70 border border-blue-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs group transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="font-bold text-slate-900">{item.companyName}</span>
                  <span className="text-slate-400 font-normal">→</span>
                  <span className="text-blue-700 font-medium">{item.roleTitle}</span>
                  <button
                    type="button"
                    onClick={() => removeSelection(item.companyId)}
                    className="ml-1 p-0.5 rounded-full hover:bg-blue-200/80 text-slate-400 hover:text-slate-700 transition"
                    title={`Remove ${item.companyName}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, roles, or technologies (e.g., Google, iOS, DevOps)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 pl-1">Filter:</span>
            {industries.slice(0, 5).map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                  selectedIndustry === ind
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading verified employers...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching companies found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or clearing the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((co, index) => {
              const isSelected = !!selectedCompanies[co.id];
              const currentRole = selectedCompanies[co.id]?.roleTitle || co.roles[0]?.title;
              const palette = companyColorPalette[index % companyColorPalette.length];

              return (
                <div
                  key={co.id}
                  className={`relative rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between bg-white ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border ${palette.bg}`}
                        >
                          {co.companyName[0]}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 leading-tight">{co.companyName}</h2>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {co.industry} • <span className="text-slate-400">{co.location}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleCompany(co)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isSelected ? 'Deselect company' : 'Select company'}
                      >
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Building2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Role Selector List */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <label className="text-xs text-slate-500 font-bold mb-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          <span>Select Target Role</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">{co.roles.length} Available</span>
                      </label>

                      <div className="space-y-2">
                        {co.roles.map((r) => {
                          const isRoleActive = isSelected && currentRole === r.title;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => {
                                if (!isSelected) toggleCompany(co);
                                selectRoleForCompany(co, r.title, r.id);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                                isRoleActive
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : isSelected
                                  ? 'bg-white hover:bg-blue-50/60 text-slate-700 border-slate-200'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                              }`}
                            >
                              <span className="truncate pr-2">{r.title}</span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${
                                  isRoleActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200/80 text-slate-600'
                                }`}
                              >
                                v{r.version}.0 Locked
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer info */}
                  <div className="mt-5 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Role-Aware Scoring</span>
                    </span>
                    <span className="font-semibold text-slate-500">
                      {isSelected ? '✓ In Candidate Path' : '+ Click to Add'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Select 1 to 10 companies to calibrate your dynamic assessment path.
          </p>

          <button
            type="button"
            onClick={handleProceedToReady}
            disabled={selectionCount === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Continue to Dynamic Assessment ({selectionCount} Selected)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
