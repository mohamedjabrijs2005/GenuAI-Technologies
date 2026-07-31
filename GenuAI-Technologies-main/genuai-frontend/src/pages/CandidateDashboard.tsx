import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
import {
  checkATS, detectFake, scoreSkills, runTriangle, evaluateAI,
  submitAssessment, sendEmail
} from "../services/api";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { ROLES } from "../constants/roles";
import { getUserName, getUserEmail, getUserId, getVerdictColor } from "../utils/formatters";
import { generateAssessmentPDF } from "../utils/pdfHelper";

interface Props {
  user: any;
  onLogout: () => void;
  onInterview?: () => void;
  onMock?: () => void;
  onResume?: () => void;
  onAMCAT?: (role: string, assessmentId?: number) => void;
}

export default function CandidateDashboard({ user, onLogout, onInterview, onResume, onMock, onAMCAT }: Props) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [answers, setAnswers] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [atsScore, setAtsScore] = useState(0);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    const email = user?.user?.email || user?.email || "";
    return email ? localStorage.getItem(`profilePhoto_${email}`) : null;
  });
  const [cheatCount, setCheatCount] = useState(0);
  const [cheatWarning, setCheatWarning] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [stressStatus, setStressStatus] = useState<string>("");
  const stressRef = useRef<any>(null);
  const stressAnalyserRef = useRef<AnalyserNode | null>(null);
  const [pitch, setPitch] = useState("");
  const [recTimer, setRecTimer] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoMode, setVideoMode] = useState<"idle" | "recording" | "recorded">("idle");
  const [pitchMode, setPitchMode] = useState<"video" | "audio" | "text">("video");
  const [keystrokeData, setKeystrokeData] = useState<number[]>([]);
  const [keystrokeAlert, setKeystrokeAlert] = useState("");
  const lastKeyTime = useRef<number>(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [bestScore, setBestScore] = useState<any>(null);
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [jobSearch, setJobSearch] = useState("");
  const [showPractice, setShowPractice] = useState(false);
  const [practiceRole, setPracticeRole] = useState("Software Engineer");
  const [practiceLevel, setPracticeLevel] = useState(1);
  const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
  const [practiceSelected, setPracticeSelected] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<any>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceStats, setPracticeStats] = useState({ attempted: 0, correct: 0 });
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [showSearchHub, setShowSearchHub] = useState(false);
  const [activeHubModule, setActiveHubModule] = useState<string | null>(null);
  const [availableJobsList, setAvailableJobsList] = useState<any[]>([]);
  const [targetJobs, setTargetJobs] = useState<number[]>([]);

  const userName = getUserName(user, "Candidate");
  const userEmail = getUserEmail(user);
  const userId = getUserId(user);

  useEffect(() => {
    Promise.all([
      axios.get(API + "/admin/companies").catch(() => ({ data: [] })),
      axios.get(API + "/jobs/list").catch(() => ({ data: { jobs: [] } }))
    ]).then(([compsRes, jobsRes]) => {
      const comps = compsRes.data || [];
      const dbJobs = jobsRes.data?.jobs || [];
      setAvailableCompanies(comps);
      const defaultJobs: any[] = [];
      comps.forEach((comp: any) => {
        const hasJobs = dbJobs.some((j: any) => j.company_id === comp.id);
        if (!hasJobs) {
          defaultJobs.push({ id: comp.id * 1000 + 1, company_id: comp.id, company_name: comp.name, title: 'Software Engineer' });
          defaultJobs.push({ id: comp.id * 1000 + 2, company_id: comp.id, company_name: comp.name, title: 'AI Engineer' });
          defaultJobs.push({ id: comp.id * 1000 + 3, company_id: comp.id, company_name: comp.name, title: 'Data Scientist' });
        }
      });
      setAvailableJobsList([...dbJobs, ...defaultJobs]);
    });
  }, []);

  // Cheat detection active during Skill Test step
  useEffect(() => {
    if (step !== 2) return;
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    const onHide = () => {
      if (document.hidden) {
        setCheatCount(p => p + 1);
        setCheatWarning("Tab switch detected! -10 points penalty.");
        setTimeout(() => setCheatWarning(""), 3000);
      }
    };
    const onCopy = (e: any) => { e.preventDefault(); setCheatWarning("Copy detected! This is logged."); setTimeout(() => setCheatWarning(""), 3000); };
    const onRC = (e: any) => { e.preventDefault(); setCheatWarning("Right-click disabled during test!"); setTimeout(() => setCheatWarning(""), 3000); };
    document.addEventListener("visibilitychange", onHide);
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onRC);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("contextmenu", onRC);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [step]);

  const startRec = async () => {
    setStressLevel(0);
    setStressStatus("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => { setAudioBlob(new Blob(chunks, { type: "audio/webm" })); setPitch("Voice pitch recorded successfully"); };
      mr.start();
      setIsRecording(true);
      setRecTimer(0);
      try {
        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        stressAnalyserRef.current = analyser;
        stressRef.current = setInterval(() => {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          const stress = Math.min(100, Math.round(avg * 2.5));
          setStressLevel(stress);
        }, 500);
      } catch { }
      timerRef.current = setInterval(() => setRecTimer(t => t + 1), 1000);
    } catch { setPitch("Microphone unavailable. Please type your pitch below."); }
  };

  const stopRec = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
    clearInterval(stressRef.current);
    if (stressAnalyserRef.current) {
      const data = new Uint8Array(stressAnalyserRef.current.frequencyBinCount);
      stressAnalyserRef.current.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      const stress = Math.min(100, Math.round(avg * 2.5));
      setStressLevel(stress);
      setStressStatus(stress > 70 ? "High stress detected — take a deep breath!" : stress > 40 ? "Moderate nervousness — you are doing well!" : "Calm and confident voice detected!");
    }
  };

  const analyzeKeystroke = () => {
    const now = Date.now();
    if (lastKeyTime.current > 0) {
      const gap = now - lastKeyTime.current;
      setKeystrokeData(prev => {
        const updated = [...prev, gap];
        if (updated.length >= 10) {
          const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
          const variance = updated.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / updated.length;
          if (avg < 80) setKeystrokeAlert("Typing speed too fast — possible AI/paste detected!");
          else if (variance < 100) setKeystrokeAlert("Unusually uniform typing — possible automated input!");
          else setKeystrokeAlert("");
        }
        return updated.slice(-20);
      });
    }
    lastKeyTime.current = now;
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const [histRes, bestRes] = await Promise.all([
        axios.get(API + "/history/" + userId),
        axios.get(API + "/history/" + userId + "/best")
      ]);
      setHistory(histRes.data.history || []);
      setBestScore(bestRes.data.best || null);
      setShowHistory(true);
    } catch { alert("Failed to load history"); }
    setHistoryLoading(false);
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get(API + "/jobs/list");
      setJobs(res.data.jobs || []);
      setShowJobs(true);
    } catch { alert("Failed to load jobs"); }
    setJobsLoading(false);
  };

  const applyJob = async (jobId: number) => {
    if (appliedJobs.includes(jobId)) return;
    try {
      await axios.post(API + "/interviews/schedule", {
        candidate_id: userId,
        job_id: jobId,
        scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Applied via Job Board"
      });
      setAppliedJobs(p => [...p, jobId]);
    } catch { setAppliedJobs(p => [...p, jobId]); }
  };

  const startPractice = async () => {
    setPracticeLoading(true);
    setPracticeFeedback(null);
    setPracticeSelected("");
    setPracticeScore(0);
    setPracticeLevel(1);
    setPracticeStats({ attempted: 0, correct: 0 });
    try {
      const res = await axios.get(API + `/skill/question/${practiceRole}/K1`);
      setPracticeQuestion(res.data);
      setPracticeLevel(1);
      setPracticeStarted(true);
    } catch { alert("Failed to load practice question"); }
    setPracticeLoading(false);
  };

  const submitPracticeAnswer = async () => {
    if (!practiceSelected) return;
    setPracticeLoading(true);
    try {
      const res = await axios.post(API + "/skill/evaluate", {
        answers: [{ id: practiceQuestion.id, answer: practiceSelected }]
      });
      const detail = res.data.results?.[0];
      const isCorrect = detail?.correct ?? false;
      setPracticeFeedback({
        is_correct: isCorrect,
        correct_answer: detail?.correct_answer,
        explanation: detail?.explanation || "No explanation available."
      });
      setPracticeScore(s => s + (isCorrect ? (practiceQuestion.marks || 1) : 0));
      setPracticeStats(p => ({ attempted: p.attempted + 1, correct: p.correct + (isCorrect ? 1 : 0) }));
    } catch { alert("Failed to submit"); }
    setPracticeLoading(false);
  };

  const nextPracticeQuestion = async () => {
    setPracticeLoading(true);
    setPracticeFeedback(null);
    setPracticeSelected("");
    try {
      const nextLevel = practiceFeedback?.is_correct ? Math.min(practiceLevel + 1, 5) : Math.max(practiceLevel - 1, 1);
      setPracticeLevel(nextLevel);
      const res = await axios.get(API + `/skill/question/${practiceRole}/K${nextLevel}`);
      setPracticeQuestion(res.data);
    } catch { alert("Failed to load next question"); }
    setPracticeLoading(false);
  };

  const handleStep1 = async () => {
    if (!github.trim()) { alert("GitHub profile URL is required!"); return; }
    if (!linkedin.trim()) { alert("LinkedIn profile URL is required!"); return; }
    if (!resumeText.trim()) { alert("Please upload your resume PDF!"); return; }
    if (!skills.trim()) { alert("Please enter your skills!"); return; }
    setLoading(true);
    try {
      const r = await checkATS({ resume_text: resumeText + " github:" + github + " linkedin:" + linkedin, job_description: "Looking for " + role + " with skills in " + skills });
      setAtsScore(r.data.ats_score || 70);
    } catch { setAtsScore(70); }
    setLoading(false);
    setStep(2);
  };

  const downloadPDF = () => {
    if (!result) return;
    generateAssessmentPDF(result, userName, role);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const skillsArr = skills.split(",").map((s: string) => s.trim());

      const [fakeRes, skillRes, aiRes] = await Promise.all([
        detectFake({ resume_text: resumeText, skills: skillsArr, test_score: 70, interview_score: 70 }),
        scoreSkills({ answers, cheat_events: cheatCount }),
        evaluateAI({ resume_text: resumeText, skills: skillsArr, test_score: 70, interview_pitch: pitch, role }),
      ]);

      const triangleRes = await runTriangle({
        resume_score: atsScore,
        interview_score: aiRes.data.interview_score || 70,
        test_score: skillRes.data.test_score || 70,
        authenticity_score: fakeRes.data.authenticity_score || 80,
      });

      const final: any = {
        ...triangleRes.data, ...aiRes.data,
        ats_score: atsScore,
        test_score: skillRes.data.test_score || 70,
        authenticity_score: fakeRes.data.authenticity_score || 80,
        cheat_count: cheatCount,
        key_strengths: aiRes.data.key_strengths || ["Problem Solving", "Communication", "Technical Skills"],
        improvement_plan: aiRes.data.improvement_plan || ["Practice more coding challenges", "Improve system design knowledge", "Work on communication skills"],
      };

      await submitAssessment({ user_id: userId, resume_text: resumeText, skills, ats_score: atsScore, resume_score: atsScore, interview_score: final.interview_score || 70, test_score: final.test_score, consistency_score: final.consistency_score, overall_score: final.overall_score, authenticity_score: final.authenticity_score, verdict: final.verdict, triangle_status: final.triangle_status, salary_min: final.salary_min, salary_max: final.salary_max, improvement_plan: JSON.stringify(final.improvement_plan || []), company_ids: selectedCompanies });
      await sendEmail({ candidateEmail: userEmail, candidateName: userName, overallScore: final.overall_score, verdict: final.verdict, salaryMin: final.salary_min, salaryMax: final.salary_max, atsScore: final.ats_score || atsScore, testScore: final.test_score || 0, interviewScore: final.interview_score || 0, authenticityScore: final.authenticity_score || 0, triangleStatus: final.triangle_status || "", role, keyStrengths: final.key_strengths || [], improvementPlan: final.improvement_plan || [] });
      setResult(final);
      setStep(4);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const vc = getVerdictColor(result?.verdict || "");
  const radarData = result ? [
    { s: "ATS", v: result.ats_score },
    { s: "Test", v: result.test_score },
    { s: "Interview", v: result.interview_score || 70 },
    { s: "Authentic", v: result.authenticity_score },
    { s: "Consistency", v: result.consistency_score },
  ] : [];

  return (
    <div className="min-h-screen bg-background quantum-gradient font-body-base text-on-background p-margin-mobile md:p-margin-desktop relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-brand/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-xl glass p-sm rounded-xl">
          <div className="flex items-center gap-sm px-sm">
            <img src="/logo.png" alt="GenuAI" className="w-11 h-11 object-contain gold-glow-subtle" />
            <div>
              <div className="font-bold text-lg text-on-surface leading-tight">Genu<span className="text-accent-gold">AI</span></div>
              <div className="text-[10px] text-on-surface-variant font-semibold tracking-widest uppercase">TECHNOLOGIES</div>
            </div>
          </div>
          <div className="flex gap-xs items-center px-sm">
            {onResume && <button onClick={onResume} className="px-sm py-xs bg-surface-bright text-indigo-brand rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">📄 Resume</button>}
            <button onClick={fetchHistory} disabled={historyLoading} className="px-sm py-xs bg-surface-bright text-[#F97316] rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">📊 History</button>
            <button onClick={fetchJobs} disabled={jobsLoading} className="px-sm py-xs bg-surface-bright text-accent-gold rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">💼 Jobs</button>
            <button onClick={() => setShowSearchHub(true)} className="px-sm py-xs bg-surface-bright text-[#2563EB] rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">🌐 Search Hub</button>
            <button onClick={() => { setShowPractice(true); setPracticeStarted(false); setPracticeFeedback(null); setPracticeSelected(""); }} className="px-sm py-xs bg-surface-bright text-[#7C3AED] rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">🎯 Practice</button>
            {onMock && <button onClick={onMock} className="px-sm py-xs bg-surface-bright text-[#7C3AED] rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">🎓 Mock</button>}
            {onInterview && <button onClick={onInterview} className="px-sm py-xs bg-surface-bright text-[#0891B2] rounded-lg font-bold text-xs hover:bg-surface transition-colors border border-surface-container">🎥 Room</button>}
            <div className="w-[1px] h-6 bg-surface-container mx-xs" />
            <div className="w-9 h-9 rounded-full bg-surface-bright flex items-center justify-center font-black text-accent-gold text-sm ring-2 ring-accent-gold/20 overflow-hidden shrink-0">
              {profilePhoto ? <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" /> : userName.charAt(0).toUpperCase()}
            </div>
            <button onClick={onLogout} className="px-sm py-xs bg-transparent border border-error text-error rounded-lg text-xs font-bold hover:bg-error/10 transition-colors">Logout</button>
          </div>
        </div>

        {step > 0 && (
          <div className="flex gap-sm mb-xl">
            {["Profile and Resume", "Skill Test", "Voice Pitch", "Results"].map((s, i) => (
              <div key={i} className={`flex-1 p-sm text-center rounded-xl text-sm font-bold transition-all ${step === i + 1 ? 'glass-gold text-accent-gold ring-1 ring-accent-gold/50 shadow-[0_0_15px_rgba(233,196,0,0.15)]' : step > i + 1 ? 'bg-surface-bright text-on-surface' : 'bg-surface-container/50 text-on-surface-variant'}`}>
                {i + 1}. {s}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 0: Company Selector ── */}
        {step === 0 && (
          <div className="max-w-3xl mx-auto my-xxl">
            <div className="glass p-xl rounded-xxl text-center relative overflow-hidden">
              <div className="text-5xl mb-md">🎯</div>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-sm">Which companies are you interested in?</h2>
              <p className="text-body-base text-on-surface-variant/80 mb-xl">Select one or more companies to view their open roles.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mb-xl text-left">
                {availableCompanies.length === 0 ? (
                  <div className="col-span-2 text-sm text-on-surface-variant/80 italic p-md bg-surface-container/50 rounded-xl text-center">Loading companies...</div>
                ) : (
                  availableCompanies.map(c => (
                    <div key={c.id} onClick={() => setSelectedCompanies(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                      className={`p-md border-2 rounded-xl cursor-pointer flex items-center gap-sm transition-all hover:scale-[1.02] ${selectedCompanies.includes(c.id) ? 'border-accent-gold bg-accent-gold/10' : 'border-surface-container bg-surface-bright hover:border-surface-container-high'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedCompanies.includes(c.id) ? 'border-accent-gold bg-accent-gold' : 'border-surface-container bg-surface-bright'}`}>
                        {selectedCompanies.includes(c.id) && <span className="text-on-tertiary text-xs font-bold material-symbols-outlined" style={{fontSize: "14px"}}>check</span>}
                      </div>
                      <span className={`text-body-base font-bold ${selectedCompanies.includes(c.id) ? 'text-accent-gold' : 'text-on-surface'}`}>{c.name}</span>
                    </div>
                  ))
                )}
              </div>

              {selectedCompanies.length > 0 && (
                <div className="text-left mb-xl p-lg bg-surface-container/30 rounded-xl border border-surface-container">
                  <h3 className="mb-md text-on-surface text-lg font-bold">Available Vacancies</h3>
                  {availableJobsList.filter(j => selectedCompanies.includes(j.company_id)).length === 0 ? (
                    <div className="text-on-surface-variant/80 text-sm">No active vacancies posted by the selected companies right now. You can still continue to the general assessment.</div>
                  ) : (
                    <div className="flex flex-col gap-sm">
                      {availableJobsList.filter(j => selectedCompanies.includes(j.company_id)).map(job => (
                        <div key={job.id} onClick={() => setTargetJobs(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id])}
                          className={`p-md border-2 rounded-xl cursor-pointer flex justify-between items-center transition-all hover:scale-[1.01] ${targetJobs.includes(job.id) ? 'border-indigo-brand bg-indigo-brand/10' : 'border-surface-container bg-surface-bright hover:border-surface-container-high'}`}>
                          <div>
                            <div className={`font-bold text-body-base mb-xs ${targetJobs.includes(job.id) ? 'text-indigo-brand' : 'text-on-surface'}`}>{job.title}</div>
                            <div className="text-xs text-on-surface-variant">🏢 {job.company_name}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${targetJobs.includes(job.id) ? 'border-indigo-brand bg-indigo-brand' : 'border-surface-container bg-surface-bright'}`}>
                            {targetJobs.includes(job.id) && <span className="text-white text-xs font-bold material-symbols-outlined" style={{fontSize: "14px"}}>check</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setStep(1)} disabled={selectedCompanies.length === 0}
                className={`px-xl py-md border-none rounded-xl font-bold text-body-base transition-all ${selectedCompanies.length === 0 ? 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed' : 'bg-accent-gold text-on-tertiary cursor-pointer hover:shadow-[0_0_20px_rgba(233,196,0,0.4)] hover:scale-105'}`}>
                Continue to Assessment →
              </button>
            </div>
          </div>
        )}

      {/* Practice Mode Modal */}
      {showPractice && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-margin-mobile md:p-margin-desktop">
          <div className="glass p-xl rounded-xxl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative animate-[fadeIn_0.3s_ease]">
            <div className="flex justify-between items-center mb-xl sticky top-0 bg-white/50 backdrop-blur-md p-sm -mx-sm -mt-sm rounded-xl z-10 border border-surface-container/50">
              <div>
                <h2 className="text-headline-sm font-headline-sm text-on-surface mb-0">🎯 Practice Mode</h2>
                <div className="text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider mt-1">Unlimited practice — scores do NOT affect assessment</div>
              </div>
              <button onClick={() => { setShowPractice(false); setPracticeStarted(false); }} className="px-sm py-xs bg-surface-container/50 text-on-surface-variant rounded-lg font-bold hover:bg-surface-container transition-colors">✕ Close</button>
            </div>

            {!practiceStarted ? (
              <div className="text-center py-xl">
                <div className="text-6xl mb-md drop-shadow-md">🧠</div>
                <p className="text-body-base text-on-surface-variant/80 mb-xl max-w-md mx-auto">Practice skill questions for any role. Get instant feedback with explanations. No pressure — this never affects your real score.</p>
                <div className="mb-xl max-w-xs mx-auto text-left">
                  <label className="text-sm font-bold text-on-surface-variant mb-xs block">Select Role to Practice</label>
                  <select value={practiceRole} onChange={e => setPracticeRole(e.target.value)} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-body-base font-semibold text-on-surface focus:outline-none focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 transition-all">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <button onClick={startPractice} disabled={practiceLoading} className="px-xl py-md bg-indigo-brand text-white rounded-xl font-bold text-body-base hover:shadow-[0_0_20px_rgba(102,126,234,0.4)] hover:scale-105 transition-all">
                  {practiceLoading ? "Loading..." : "🚀 Start Practice"}
                </button>
              </div>
            ) : (
              <div className="animate-[slideUp_0.4s_ease]">
                <div className="flex justify-between items-center mb-xl bg-surface-bright border border-surface-container rounded-xl p-md shadow-sm">
                  <div className="flex gap-lg">
                    <div><div className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase mb-1">Attempted</div><div className="text-headline-sm font-black text-on-surface">{practiceStats.attempted}</div></div>
                    <div><div className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase mb-1">Correct</div><div className="text-headline-sm font-black text-success">{practiceStats.correct}</div></div>
                    <div><div className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase mb-1">Accuracy</div><div className="text-headline-sm font-black text-indigo-brand">{practiceStats.attempted > 0 ? Math.round((practiceStats.correct / practiceStats.attempted) * 100) : 0}%</div></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase mb-1">Role</div>
                    <div className="text-sm font-bold text-[#8B5CF6]">{practiceRole}</div>
                  </div>
                </div>

                {practiceQuestion && (
                  <div>
                    <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-xl p-lg mb-lg">
                      <div className="flex gap-sm mb-md">
                        <span className="px-xs py-1 bg-[#8B5CF6] text-white rounded-full text-xs font-bold">K{practiceLevel} — {practiceLevel === 1 ? "Easy" : practiceLevel === 2 ? "Medium" : practiceLevel === 3 ? "Hard" : practiceLevel === 4 ? "Advanced" : "Expert"}</span>
                        <span className="px-xs py-1 bg-surface-container/50 text-on-surface-variant rounded-full text-xs font-semibold">{practiceQuestion.marks} mark{practiceQuestion.marks > 1 ? "s" : ""}</span>
                        <span className="px-xs py-1 bg-success/10 text-success rounded-full text-xs font-bold border border-success/20">Practice — No Penalty</span>
                      </div>
                      <p className="text-body-lg font-bold text-on-surface leading-relaxed">{practiceQuestion.question_text}</p>
                    </div>

                    {practiceFeedback ? (
                      <div className="animate-[fadeIn_0.3s_ease]">
                        <div className={`p-md rounded-xl border mb-md ${practiceFeedback.is_correct ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'}`}>
                          <div className={`font-black text-body-base mb-xs ${practiceFeedback.is_correct ? 'text-success' : 'text-error'}`}>
                            {practiceFeedback.is_correct ? "✅ Correct! Well done!" : "❌ Incorrect! Correct answer: " + practiceFeedback.correct_answer}
                          </div>
                          <div className="text-sm text-on-surface-variant/90 leading-relaxed font-medium">{practiceFeedback.explanation}</div>
                        </div>
                        <div className="flex gap-sm">
                          <button onClick={nextPracticeQuestion} disabled={practiceLoading} className="flex-1 py-md bg-indigo-brand text-white rounded-xl font-bold hover:shadow-[0_0_15px_rgba(102,126,234,0.3)] transition-all">
                            {practiceLoading ? "Loading..." : "Next Question →"}
                          </button>
                          <button onClick={() => { setPracticeStarted(false); setPracticeStats({ attempted: 0, correct: 0 }); }} className="px-lg py-md bg-surface-container/30 text-on-surface-variant rounded-xl font-bold hover:bg-surface-container/50 transition-colors">
                            Change Role
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mb-lg">
                          {["A", "B", "C", "D"].map(opt => (
                            <button key={opt} onClick={() => setPracticeSelected(opt)}
                              className={`p-md rounded-xl border-2 text-left text-sm transition-all hover:scale-[1.01] ${practiceSelected === opt ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold shadow-sm' : 'border-surface-container bg-surface-bright text-on-surface font-semibold hover:border-surface-container-high'}`}>
                              <span className="font-black mr-sm text-lg">{opt}.</span>
                              {practiceQuestion["option_" + opt.toLowerCase()]}
                            </button>
                          ))}
                        </div>
                        <button onClick={submitPracticeAnswer} disabled={practiceLoading || !practiceSelected}
                          className={`w-full py-md rounded-xl font-bold text-body-base transition-all ${practiceSelected ? 'bg-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02]' : 'bg-surface-container/50 text-on-surface-variant/50 cursor-not-allowed'}`}>
                          {practiceLoading ? "Checking..." : practiceSelected ? "Submit Answer →" : "Select an option"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Hub Modal */}
      {showSearchHub && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-margin-mobile md:p-margin-desktop">
          <div className={`glass p-xl rounded-xxl w-full ${activeHubModule && activeHubModule !== "Instant Connect" ? "max-w-4xl" : "max-w-5xl"} h-[85vh] overflow-hidden flex flex-col relative animate-[fadeIn_0.3s_ease]`}>
            <div className="flex justify-between items-center mb-xl shrink-0 border-b border-surface-container/50 pb-sm">
              <div className="flex items-center gap-sm">
                {activeHubModule && (
                  <button onClick={() => setActiveHubModule(null)} className="p-xs bg-surface-container/30 hover:bg-surface-container/60 rounded-full transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                  </button>
                )}
                <div>
                  <h2 className="text-headline-sm font-headline-sm text-on-surface mb-0">{activeHubModule ? activeHubModule : "🌐 GenuAI Search Hub"}</h2>
                  <div className="text-xs font-semibold text-on-surface-variant/80 uppercase tracking-wider mt-1">{activeHubModule ? "Explore opportunities and connections" : "Your centralized platform for networking, jobs, and industry updates"}</div>
                </div>
              </div>
              <button onClick={() => { setShowSearchHub(false); setActiveHubModule(null); }} className="px-sm py-xs bg-surface-container/50 text-on-surface-variant rounded-lg font-bold hover:bg-surface-container transition-colors">✕ Close</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-xs custom-scrollbar">
              {!activeHubModule ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {[
                    { id: "Professional Network", icon: <span className="material-symbols-outlined text-[32px]">handshake</span>, color: "text-[#0A66C2] bg-[#0A66C2]/10 border-[#0A66C2]/30", shadow: "hover:shadow-[0_10px_30px_rgba(10,102,194,0.15)] hover:border-[#0A66C2]", desc: "Connect with professionals, share updates, and build your profile (LinkedIn Style)" },
                    { id: "Global Job Board", icon: <span className="material-symbols-outlined text-[32px]">public</span>, color: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/30", shadow: "hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] hover:border-[#2563EB]", desc: "Search thousands of job listings across top platforms (Indeed/NaukriGulf Style)" },
                    { id: "Competitions & Events", icon: <span className="material-symbols-outlined text-[32px]">emoji_events</span>, color: "text-warning bg-warning/10 border-warning/30", shadow: "hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:border-warning", desc: "Participate in hackathons and case studies (Unstop Style)" },
                    { id: "PM Internship Allocation", icon: <span className="material-symbols-outlined text-[32px]">psychology</span>, color: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30", shadow: "hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]", desc: "AI-based matching scheme for Product Management roles" },
                    { id: "Tech & Corporate News", icon: <span className="material-symbols-outlined text-[32px]">newspaper</span>, color: "text-success bg-success/10 border-success/30", shadow: "hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:border-success", desc: "Stay updated with the latest in tech, business, and startups" },
                    { id: "Instant Connect", icon: <span className="material-symbols-outlined text-[32px]">chat</span>, color: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30", shadow: "hover:shadow-[0_10px_30px_rgba(37,211,102,0.15)] hover:border-[#25D366]", desc: "Real-time messenger to connect with recruiters and peers" },
                  ].map(mod => (
                    <div key={mod.id} onClick={() => setActiveHubModule(mod.id)}
                      className={`bg-surface-bright border-2 border-surface-container rounded-xl p-lg cursor-pointer transition-all hover:-translate-y-1 flex flex-col gap-sm ${mod.shadow}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl ${mod.color}`}>{mod.icon}</div>
                      <h3 className="text-body-lg font-bold text-on-surface m-0">{mod.id}</h3>
                      <p className="text-sm font-medium text-on-surface-variant/80 m-0 leading-relaxed">{mod.desc}</p>
                    </div>
                  ))}
                </div>
              ) : activeHubModule === "Tech & Corporate News" ? (
                <div className="flex flex-col gap-sm animate-[slideUp_0.4s_ease]">
                  {[
                    { tag: "AI Trends", title: "OpenAI Announces New Advanced Reasoning Models", src: "TechCrunch", time: "2 hours ago" },
                    { tag: "Hiring", title: "Top 10 Tech Companies Actively Hiring Remote Product Managers", src: "Forbes", time: "5 hours ago" },
                    { tag: "Startups", title: "GenuAI Technologies Secures Funding to Revolutionize AI Recruitment", src: "Tech Radar", time: "1 day ago" },
                    { tag: "Development", title: "React 19 Release: What Frontend Engineers Need to Know", src: "Dev.to", time: "2 days ago" },
                  ].map((news, i) => (
                    <div key={i} className="p-md bg-surface-bright border border-surface-container rounded-xl flex flex-col gap-xs transition-all hover:-translate-y-0.5 hover:shadow-sm hover:border-surface-container-high cursor-pointer">
                      <span className="text-xs font-bold text-success bg-success/10 px-xs py-1 rounded-md self-start">{news.tag}</span>
                      <h4 className="m-0 text-body-lg font-bold text-on-surface">{news.title}</h4>
                      <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{news.src} • {news.time}</div>
                    </div>
                  ))}
                </div>
              ) : activeHubModule === "Instant Connect" ? (
                <div className="flex h-full border border-surface-container rounded-xl overflow-hidden animate-[fadeIn_0.4s_ease]">
                  <div className="w-64 bg-surface-bright border-r border-surface-container flex flex-col">
                    <div className="p-md border-b border-surface-container font-black text-on-surface text-body-base">Recent Chats</div>
                    <div className="p-sm bg-surface-container/30 flex items-center gap-sm border-b border-surface-container cursor-pointer hover:bg-surface-container/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-[#059669] flex items-center justify-center text-white font-black text-sm shrink-0">HR</div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-bold text-on-surface truncate">HR Tech Solutions</div>
                        <div className="text-xs font-medium text-on-surface-variant truncate">Are you available for an...</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-background/50 relative">
                    <div className="p-md bg-surface-bright border-b border-surface-container flex items-center gap-sm sticky top-0 z-10 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-[#059669] flex items-center justify-center text-white font-black text-sm">HR</div>
                      <div>
                        <div className="font-bold text-on-surface text-sm">HR Tech Solutions</div>
                        <div className="text-xs font-bold text-success flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-success"></div>Online</div>
                      </div>
                    </div>
                    <div className="flex-1 p-lg overflow-y-auto flex flex-col gap-md">
                      <div className="self-center bg-surface-container text-on-surface-variant px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Today</div>
                      <div className="self-start bg-surface-bright p-sm rounded-2xl rounded-tl-sm max-w-[75%] border border-surface-container shadow-sm">
                        <div className="text-sm text-on-surface font-medium leading-relaxed">Hi {userName}! We reviewed your impressive assessment score and would love to schedule a technical interview. Are you available sometime tomorrow?</div>
                        <div className="text-[10px] text-on-surface-variant mt-xs text-right font-semibold">10:42 AM</div>
                      </div>
                    </div>
                    <div className="p-md bg-surface-bright border-t border-surface-container flex gap-sm items-center">
                      <button className="bg-transparent border-none text-xl cursor-pointer opacity-60 hover:opacity-100 transition-opacity flex items-center"><span className="material-symbols-outlined">attach_file</span></button>
                      <input placeholder="Type your message..." className="flex-1 px-md py-sm border border-surface-container rounded-full outline-none text-sm bg-background font-medium text-on-surface focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand transition-all" />
                      <button className="bg-[#25D366] text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-on-surface-variant bg-surface-bright/50 rounded-xl border-2 border-dashed border-surface-container animate-[fadeIn_0.3s_ease]">
                  <div className="text-6xl mb-md opacity-80 drop-shadow-sm">🚀</div>
                  <h3 className="m-0 mb-xs text-on-surface text-headline-sm font-black">Coming Soon</h3>
                  <p className="m-0 text-center max-w-sm text-sm font-medium leading-relaxed">The <strong className="text-on-surface">{activeHubModule}</strong> module is currently in development by the GenuAI team. Stay tuned for the next update!</p>
                  <button onClick={() => setActiveHubModule(null)} className="mt-xl px-md py-sm bg-surface-bright border border-surface-container rounded-xl text-on-surface font-bold cursor-pointer shadow-sm hover:bg-surface-container/30 transition-colors">← Back to Hub</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* ── STEP 1: Profile and Resume ── */}
        {step === 1 && (
          <div className="flex flex-col lg:flex-row gap-lg items-start animate-[fadeIn_0.4s_ease]">
            <div className="flex-[0_0_100%] lg:flex-[0_0_59%] glass p-xl rounded-xxl">
              <div className="mb-lg">
                <h2 className="text-headline-sm font-headline-sm text-on-surface m-0 mb-xs">📋 Profile &amp; Resume</h2>
                <p className="text-sm font-medium text-on-surface-variant m-0">Fill in your details to begin your assessment.</p>
              </div>

              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs block">Target Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-md bg-surface-bright border border-surface-container rounded-xl text-body-base font-semibold text-on-surface mb-md focus:outline-none focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 transition-all">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>

              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs block">GitHub Profile URL</label>
              <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/yourusername" className="w-full p-md bg-surface-bright border border-surface-container rounded-xl text-body-base font-medium text-on-surface mb-md focus:outline-none focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 transition-all placeholder:text-on-surface-variant/40" />

              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs block">LinkedIn Profile URL</label>
              <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="w-full p-md bg-surface-bright border border-surface-container rounded-xl text-body-base font-medium text-on-surface mb-md focus:outline-none focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 transition-all placeholder:text-on-surface-variant/40" />

              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs block">Upload Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={async e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const fd = new FormData();
                fd.append("file", f);
                try {
                  const res = await axios.post(API + "/upload-resume", fd);
                  setResumeText(res.data.text || "");
                } catch { setResumeText("Resume uploaded"); }
              }} className="w-full p-sm bg-surface-bright border border-surface-container rounded-xl text-sm font-medium text-on-surface mb-md file:mr-md file:py-sm file:px-md file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-brand/10 file:text-indigo-brand hover:file:bg-indigo-brand/20 transition-all" />
              {resumeText && <div className="px-md py-sm bg-success/10 border border-success/20 rounded-lg text-success text-xs font-bold mb-md animate-[fadeIn_0.3s_ease]">✅ PDF loaded — ready for analysis</div>}

              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-xs block">Your Skills (comma separated)</label>
              <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Python, React, SQL, Machine Learning..." className="w-full p-md bg-surface-bright border border-surface-container rounded-xl text-body-base font-medium text-on-surface mb-md focus:outline-none focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/20 transition-all placeholder:text-on-surface-variant/40" />

              {atsScore > 0 && <div className="px-md py-sm bg-success/10 border border-success/30 rounded-xl text-success font-black text-body-base mb-md animate-[fadeIn_0.3s_ease] shadow-sm">🎯 ATS Score: {atsScore}%</div>}

              <button onClick={handleStep1} disabled={loading || !resumeText} className={`w-full py-md rounded-xl font-bold text-body-base mt-sm transition-all ${loading || !resumeText ? 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed' : 'bg-indigo-brand text-white hover:shadow-[0_4px_20px_rgba(102,126,234,0.4)] hover:scale-[1.01]'}`}>
                {loading ? "Analyzing Resume..." : "Analyze and Continue →"}
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-lg w-full">
              <div className="glass p-lg rounded-xxl">
                <div className="text-sm font-black text-on-surface mb-md uppercase tracking-wide">🪪 Candidate Profile</div>
                <div className="flex flex-col items-center mb-md">
                  <div onClick={() => (document.getElementById("profile-photo-input") as HTMLInputElement)?.click()}
                    className={`w-24 h-32 rounded-xl overflow-hidden flex flex-col items-center justify-center gap-1 mb-sm cursor-pointer transition-all ${profilePhoto ? 'border-2 border-success bg-background' : 'border-2 border-dashed border-surface-container bg-surface-bright hover:border-surface-container-high'}`}>
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="text-3xl opacity-80">📷</div>
                        <div className="text-[10px] text-on-surface-variant text-center leading-tight px-1 font-semibold">Passport size photo</div>
                      </>
                    )}
                  </div>
                  <input id="profile-photo-input" type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setProfilePhoto(URL.createObjectURL(f));
                  }} />
                  <button onClick={() => (document.getElementById("profile-photo-input") as HTMLInputElement)?.click()}
                    className={`px-md py-1.5 rounded-lg text-xs font-bold transition-colors ${profilePhoto ? 'bg-success/10 text-success border border-success/30' : 'bg-indigo-brand text-white'}`}>
                    {profilePhoto ? "✅ Uploaded" : "Upload Photo"}
                  </button>
                </div>
                <div className="border-t border-surface-container pt-md flex flex-col gap-md">
                  <div><div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Full Name</div><div className="font-black text-on-surface text-body-lg">{userName}</div></div>
                  <div><div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Email</div><div className="font-medium text-on-surface-variant text-sm break-all">{userEmail || "—"}</div></div>
                  <div><div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Target Role</div><span className="px-sm py-1 bg-indigo-brand/10 border border-indigo-brand/20 text-indigo-brand rounded-full text-xs font-black inline-block mt-1">{role}</span></div>
                  {github && <div><div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">GitHub</div><div className="font-medium text-on-surface-variant text-xs break-all">{github}</div></div>}
                  {linkedin && <div><div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">LinkedIn</div><div className="font-medium text-on-surface-variant text-xs break-all">{linkedin}</div></div>}
                </div>
              </div>

              <div className="glass p-lg rounded-xxl">
                <div className="text-sm font-black text-on-surface mb-md uppercase tracking-wide">📊 Resume Analysis</div>
                {atsScore > 0 ? (
                  <div className="animate-[fadeIn_0.4s_ease]">
                    <div className="flex justify-between items-end mb-xs">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ATS Match Score</span>
                      <span className={`text-xl font-black leading-none ${atsScore >= 70 ? 'text-success' : atsScore >= 50 ? 'text-warning' : 'text-error'}`}>{atsScore}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full mb-sm overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${atsScore >= 70 ? 'bg-gradient-to-r from-success to-[#00D4AA]' : atsScore >= 50 ? 'bg-gradient-to-r from-warning to-[#FBBF24]' : 'bg-gradient-to-r from-error to-[#F87171]'}`} style={{ width: `${atsScore}%` }} />
                    </div>
                    <div className="text-xs font-semibold text-on-surface-variant/90">{atsScore >= 70 ? "✅ Strong match for the role" : atsScore >= 50 ? "⚠️ Moderate — consider improving resume" : "❌ Low match — update your resume"}</div>
                  </div>
                ) : (
                  <div className="text-center py-md opacity-70">
                    <div className="text-4xl mb-xs drop-shadow-sm">📄</div>
                    <div className="text-xs font-semibold text-on-surface-variant">Upload your resume to see ATS score</div>
                  </div>
                )}
                {resumeText && (
                  <div className="mt-md p-sm bg-surface-bright border border-surface-container rounded-xl">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Resume Preview</div>
                    <div className="text-[11px] font-medium text-on-surface-variant/80 leading-relaxed max-h-[72px] overflow-hidden">{resumeText.substring(0, 220)}...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Job Board Modal */}
        {showJobs && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-margin-mobile md:p-margin-desktop">
            <div className="glass p-xl rounded-xxl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative animate-[fadeIn_0.3s_ease]">
              <div className="flex justify-between items-center mb-xl sticky top-0 bg-white/50 backdrop-blur-md p-sm -mx-sm -mt-sm rounded-xl z-10 border border-surface-container/50">
                <h2 className="text-headline-sm font-headline-sm text-on-surface m-0">💼 Job Board</h2>
                <button onClick={() => setShowJobs(false)} className="px-sm py-xs bg-surface-container/50 text-on-surface-variant rounded-lg font-bold hover:bg-surface-container transition-colors">✕ Close</button>
              </div>
              <input value={jobSearch} onChange={e => setJobSearch(e.target.value)} placeholder="🔍 Search jobs by title or skills..." className="w-full p-md bg-surface-bright border border-surface-container rounded-xl text-sm font-medium text-on-surface mb-xl outline-none focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand transition-all shadow-sm" />
              {jobs.length === 0 ? (
                <div className="text-center py-xxxl text-on-surface-variant opacity-80">
                  <div className="text-5xl mb-sm drop-shadow-sm">📭</div>
                  <div className="font-semibold text-body-base">No jobs posted yet. Check back soon!</div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-sm">{jobs.filter(j => !jobSearch || j.title?.toLowerCase().includes(jobSearch.toLowerCase()) || j.skills?.toLowerCase().includes(jobSearch.toLowerCase())).length} jobs available</div>
                  <div className="flex flex-col gap-sm">
                    {jobs.filter(j => !jobSearch || j.title?.toLowerCase().includes(jobSearch.toLowerCase()) || j.skills?.toLowerCase().includes(jobSearch.toLowerCase())).map((job) => (
                      <div key={job.id} className="bg-surface-bright border border-surface-container rounded-xl p-md transition-all hover:border-surface-container-high hover:shadow-sm">
                        <div className="flex justify-between items-start mb-sm">
                          <div>
                            <h3 className="m-0 text-body-lg font-bold text-on-surface mb-1">{job.title}</h3>
                            <div className="text-xs font-semibold text-on-surface-variant">{job.company_name || "Company"} {job.location ? "· " + job.location : ""}</div>
                          </div>
                          <div className="text-right">
                            {job.salary_min > 0 && <div className="text-sm font-black text-success">₹{job.salary_min}L – ₹{job.salary_max}L/yr</div>}
                            <div className="text-[11px] font-semibold text-on-surface-variant mt-1 uppercase">{new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                          </div>
                        </div>
                        {job.description && <p className="m-0 mb-md text-sm font-medium text-on-surface-variant/90 leading-relaxed">{job.description.substring(0, 150)}{job.description.length > 150 ? "..." : ""}</p>}
                        {job.skills && (
                          <div className="flex flex-wrap gap-xs mb-md">
                            {job.skills.split(",").map((s: string) => s.trim()).filter(Boolean).map((skill: string, i: number) => (
                              <span key={i} className="px-sm py-1 bg-indigo-brand/10 text-indigo-brand rounded-full text-[11px] font-bold border border-indigo-brand/20">{skill}</span>
                            ))}
                          </div>
                        )}
                        <button onClick={() => applyJob(job.id)} className={`px-lg py-sm rounded-xl font-bold text-xs transition-all ${appliedJobs.includes(job.id) ? 'bg-success/10 text-success border border-success/30 cursor-default' : 'bg-success text-white hover:shadow-[0_4px_15px_rgba(0,184,124,0.3)] hover:-translate-y-0.5 cursor-pointer'}`}>
                          {appliedJobs.includes(job.id) ? "✅ Applied!" : "Apply Now →"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Score History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-margin-mobile md:p-margin-desktop">
            <div className="glass p-xl rounded-xxl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative animate-[fadeIn_0.3s_ease]">
              <div className="flex justify-between items-center mb-xl sticky top-0 bg-white/50 backdrop-blur-md p-sm -mx-sm -mt-sm rounded-xl z-10 border border-surface-container/50">
                <h2 className="text-headline-sm font-headline-sm text-on-surface m-0">📊 My Score History</h2>
                <button onClick={() => setShowHistory(false)} className="px-sm py-xs bg-surface-container/50 text-on-surface-variant rounded-lg font-bold hover:bg-surface-container transition-colors">✕ Close</button>
              </div>
              {bestScore && (
                <div className="bg-indigo-brand/5 border border-indigo-brand/20 rounded-xl p-lg mb-xl flex flex-wrap gap-lg">
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">🏆 Personal Best</div>
                    <div className="text-5xl font-black text-indigo-brand mb-1 leading-none">{bestScore.overall_score}%</div>
                    <div className="text-xs font-semibold text-on-surface-variant uppercase">{new Date(bestScore.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  {([["ATS", bestScore.ats_score, "text-success"], ["Test", bestScore.test_score, "text-warning"], ["Interview", bestScore.interview_score, "text-[#8B5CF6]"], ["Authenticity", bestScore.authenticity_score, "text-[#00D4FF]"]] as [string, number, string][]).map(([l, v, colorClass]) => (
                    <div key={l} className="text-center min-w-[80px]">
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{l}</div>
                      <div className={`text-3xl font-black ${colorClass}`}>{v ?? "—"}%</div>
                    </div>
                  ))}
                </div>
              )}
              {history.length === 0 ? (
                <div className="text-center py-xxxl text-on-surface-variant opacity-80">
                  <div className="text-5xl mb-sm drop-shadow-sm">📭</div>
                  <div className="font-semibold text-body-base">No test history yet. Complete your first assessment!</div>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  {history.map((h: any, i: number) => (
                    <div key={i} className="bg-surface-bright border border-surface-container rounded-xl p-md flex justify-between items-center flex-wrap gap-md transition-all hover:border-surface-container-high hover:shadow-sm">
                      <div>
                        <div className="font-black text-on-surface text-body-lg mb-0.5">{h.overall_score}% Overall</div>
                        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                      <div className="flex gap-md flex-wrap">
                        {([["ATS", h.ats_score, "text-success"], ["Test", h.test_score, "text-warning"], ["Interview", h.interview_score, "text-[#8B5CF6]"]] as [string, number, string][]).map(([l, v, colorClass]) => (
                          <div key={l} className="text-center">
                            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{l}</div>
                            <div className={`text-lg font-black ${colorClass}`}>{v ?? "—"}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Skill Test Start Screen ── */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto w-full animate-[slideUp_0.4s_ease]">
            <div className="glass p-xxxl rounded-xxxl text-center shadow-lg border border-surface-container/50">
              <div className="text-6xl mb-md drop-shadow-sm">🧠</div>
              <h2 className="text-headline-md font-headline-md text-on-surface m-0 mb-sm">Adaptive Skill Test</h2>
              <p className="text-on-surface-variant font-medium text-body-base m-0 mb-xl max-w-lg mx-auto">Take our AI-powered AMCAT skill assessment to measure your technical proficiency.</p>
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-md mb-md text-left inline-block">
                <div className="text-[#92400E] text-xs font-bold leading-relaxed">🔒 <strong className="uppercase tracking-wider">Proctored Mode:</strong> Full-screen mode is active. Tab switching will be flagged.</div>
              </div>
              {cheatWarning && (
                <div className="bg-error/10 border border-error/30 rounded-xl p-sm mb-md text-error font-bold text-sm animate-[fadeIn_0.2s_ease]">⚠️ {cheatWarning}</div>
              )}
              <div className="block mt-xl">
                <button
                  onClick={() => onAMCAT ? onAMCAT(role) : setStep(3)}
                  className="px-xxl py-lg text-white border-none rounded-2xl font-black text-lg cursor-pointer transition-all bg-gradient-to-r from-indigo-brand to-[#764BA2] hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] hover:-translate-y-1">
                  🚀 Start Skill Test
                </button>
                <div className="mt-md">
                  <button onClick={() => setStep(3)} className="text-sm text-on-surface-variant font-semibold underline hover:text-on-surface transition-colors">
                    Skip Skill Test → Go to Voice Pitch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Voice Pitch ── */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto w-full animate-[slideUp_0.4s_ease]">
            <div className="glass p-xxxl rounded-xxxl shadow-lg border border-surface-container/50">
              <div className="text-center mb-xl">
                <div className="text-6xl mb-sm drop-shadow-sm">🎤</div>
                <h2 className="text-headline-md font-headline-md text-on-surface m-0 mb-xs">Voice Pitch</h2>
                <p className="text-on-surface-variant font-medium text-body-base m-0 max-w-md mx-auto">Record your 60-second pitch. Tell us why you're the right candidate.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-sm mb-xl bg-surface-bright p-xs rounded-xl border border-surface-container shadow-sm">
                {(["video", "audio", "text"] as const).map(m => (
                  <button key={m} onClick={() => setPitchMode(m)}
                    className={`flex-1 py-sm rounded-lg font-bold text-sm transition-all ${pitchMode === m ? 'bg-white shadow-sm text-indigo-brand border border-surface-container' : 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 border border-transparent'}`}>
                    {m === "video" ? "📹 Video" : m === "audio" ? "🎙️ Audio" : "✍️ Text"}
                  </button>
                ))}
              </div>
              {pitchMode === "video" && (
                <div className="mb-xl animate-[fadeIn_0.3s_ease]">
                  <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full rounded-2xl bg-black max-h-[300px] object-cover mb-md shadow-md border border-surface-container" />
                  <video ref={videoRef} className="hidden" />
                  <div className="flex gap-sm">
                    {videoMode === "idle" && (
                      <button onClick={async () => {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                          if (videoPreviewRef.current) { videoPreviewRef.current.srcObject = stream; videoPreviewRef.current.muted = true; }
                          const mr = new MediaRecorder(stream);
                          mediaRef.current = mr;
                          const chunks: BlobPart[] = [];
                          mr.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
                          mr.onstop = () => { setVideoBlob(new Blob(chunks, { type: "video/webm" })); setPitch("Video pitch recorded"); stream.getTracks().forEach((t: MediaStreamTrack) => t.stop()); };
                          mr.start();
                          setVideoMode("recording");
                          timerRef.current = setInterval(() => setRecTimer(t => t + 1), 1000);
                        } catch { alert("Camera/mic access required"); }
                      }} className="flex-1 py-md bg-gradient-to-r from-error to-[#DC2626] text-white border-none rounded-xl font-black text-body-base cursor-pointer hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 transition-all">
                        🔴 Start Recording
                      </button>
                    )}
                    {videoMode === "recording" && (
                      <button onClick={() => { mediaRef.current?.stop(); clearInterval(timerRef.current); setVideoMode("recorded"); }}
                        className="flex-1 py-md bg-surface-container/50 text-error border border-error/30 rounded-xl font-black text-body-base cursor-pointer hover:bg-error/10 transition-colors animate-pulse">
                        ⏹ Stop ({recTimer}s)
                      </button>
                    )}
                    {videoMode === "recorded" && (
                      <button onClick={() => { setVideoMode("idle"); setVideoBlob(null); setRecTimer(0); }}
                        className="flex-1 py-md bg-surface-container/50 text-on-surface border border-surface-container rounded-xl font-bold text-sm cursor-pointer hover:bg-surface-container transition-colors">
                        🔄 Re-record
                      </button>
                    )}
                  </div>
                  {videoMode === "recorded" && <div className="text-success text-sm mt-sm font-bold text-center bg-success/10 p-xs rounded-lg inline-block border border-success/20">✅ Video recorded ({recTimer}s)</div>}
                </div>
              )}
              {pitchMode === "audio" && (
                <div className="mb-xl animate-[fadeIn_0.3s_ease]">
                  <div className="flex gap-sm mb-md">
                    {!isRecording
                      ? <button onClick={startRec} className="flex-1 py-md bg-gradient-to-r from-error to-[#DC2626] text-white border-none rounded-xl font-black text-body-base cursor-pointer hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 transition-all">🎙️ Start Recording</button>
                      : <button onClick={stopRec} className="flex-1 py-md bg-surface-container/50 text-error border border-error/30 rounded-xl font-black text-body-base cursor-pointer hover:bg-error/10 transition-colors animate-pulse">⏹ Stop ({recTimer}s)</button>
                    }
                  </div>
                  {audioBlob && <div className="text-success text-sm font-bold text-center bg-success/10 p-xs rounded-lg inline-block border border-success/20 mb-md">✅ Audio recorded ({recTimer}s)</div>}
                  {stressLevel > 0 && (
                    <div className="mt-md bg-surface-bright rounded-2xl p-md border border-surface-container shadow-sm animate-[fadeIn_0.4s_ease]">
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-sm flex justify-between">
                        <span>Stress Analysis</span>
                        <span className={stressLevel > 70 ? 'text-error' : stressLevel > 40 ? 'text-warning' : 'text-success'}>{stressLevel}%</span>
                      </div>
                      <div className="bg-surface-container rounded-full h-2 mb-sm overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ease-out ${stressLevel > 70 ? 'bg-error' : stressLevel > 40 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${stressLevel}%` }} />
                      </div>
                      <div className="text-xs font-semibold text-on-surface-variant">{stressStatus}</div>
                    </div>
                  )}
                </div>
              )}
              {pitchMode === "text" && (
                <div className="mb-xl animate-[fadeIn_0.3s_ease]">
                  <textarea value={pitch} onChange={e => { setPitch(e.target.value); analyzeKeystroke(); }}
                    placeholder="Tell us about yourself, your experience, and why you're a great fit..."
                    className="w-full min-h-[160px] p-md border-2 border-surface-container rounded-2xl text-body-base leading-relaxed resize-y outline-none text-on-surface bg-surface-bright focus:border-indigo-brand focus:ring-4 focus:ring-indigo-brand/10 transition-all font-medium placeholder:text-on-surface-variant/40" />
                  {keystrokeAlert && <div className="text-warning text-xs mt-sm font-bold bg-warning/10 p-sm rounded-lg border border-warning/20">⚠️ {keystrokeAlert}</div>}
                  <div className="text-[11px] font-semibold text-on-surface-variant mt-sm uppercase tracking-wider text-right">{pitch.length} characters</div>
                </div>
              )}
              <button onClick={handleSubmit} disabled={loading || (!pitch && !audioBlob && !videoBlob)}
                className={`w-full py-lg rounded-2xl font-black text-lg transition-all ${loading || (!pitch && !audioBlob && !videoBlob) ? 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-brand to-[#764ba2] text-white hover:shadow-[0_8px_30px_rgba(102,126,234,0.4)] hover:-translate-y-1 cursor-pointer'}`}>
                {loading ? "⏳ Analyzing your assessment..." : "Submit and Get Results →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Results ── */}
        {step === 4 && result && (
          <div className="max-w-4xl mx-auto w-full animate-[slideUp_0.5s_ease]">
            <div className="glass p-xxxl rounded-xxxl text-center shadow-lg border border-surface-container/50 mb-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: vc }} />
              <div className="text-7xl mb-sm drop-shadow-md">🏆</div>
              <h2 className="text-headline-md font-headline-md text-on-surface m-0 mb-sm">Assessment Complete!</h2>
              <div className="text-[80px] font-black my-md leading-none drop-shadow-sm" style={{ color: vc }}>{result.overall_score}%</div>
              <span className="inline-block px-xxl py-sm rounded-full font-black text-2xl mb-md border" style={{ backgroundColor: `${vc}15`, color: vc, borderColor: `${vc}30` }}>{result.verdict}</span>
              <div className="text-on-surface-variant font-bold text-body-base uppercase tracking-wider">{result.triangle_status}</div>
              {result.cheat_count > 0 && (
                <div className="mt-md px-md py-sm bg-error/10 border border-error/30 rounded-xl text-error text-sm font-black inline-block">
                  ⚠️ {result.cheat_count} cheat event{result.cheat_count > 1 ? "s" : ""} detected — score adjusted
                </div>
              )}
              {selectedCompanies.length > 0 && (
                <div className="mt-xl p-lg bg-success/5 border border-success/20 rounded-2xl text-left max-w-lg mx-auto">
                  <div className="font-black text-success text-body-base mb-xs flex items-center gap-xs">
                    <span className="text-xl">✅</span> Report Automatically Shared
                  </div>
                  <div className="text-sm text-success/80 font-semibold mb-md">Your assessment results have been directly sent to:</div>
                  <div className="flex gap-sm flex-wrap">
                    {availableCompanies.filter(c => selectedCompanies.includes(c.id)).map(c => (
                      <span key={c.id} className="px-sm py-xs bg-white border border-success/30 rounded-lg text-success text-xs font-bold shadow-sm">🏢 {c.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass p-xxl rounded-xxxl shadow-sm border border-surface-container/50 mb-lg">
              <div className="font-black text-on-surface text-title-md mb-xl flex items-center gap-xs"><span className="text-2xl">📊</span> Score Breakdown</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                {([
                  ["📄 ATS / Resume", result.ats_score, "text-success", "bg-success"],
                  ["🧠 Skill Test", result.test_score, "text-indigo-brand", "bg-indigo-brand"],
                  ["🎤 Interview / Pitch", result.interview_score, "text-[#8B5CF6]", "bg-[#8B5CF6]"],
                  ["✅ Authenticity", result.authenticity_score, "text-[#00D4FF]", "bg-[#00D4FF]"],
                  ["🔁 Consistency", result.consistency_score, "text-warning", "bg-warning"],
                ] as [string, number, string, string][]).map(([label, val, textColor, bgColor]) => (
                  <div key={label} className="bg-surface-bright border border-surface-container rounded-2xl p-md hover:border-surface-container-high transition-colors hover:shadow-sm">
                    <div className="text-xs font-bold text-on-surface-variant mb-xs">{label}</div>
                    <div className={`text-3xl font-black ${textColor}`}>{val ?? "—"}%</div>
                    <div className="bg-surface-container rounded-full h-1.5 mt-sm overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${bgColor}`} style={{ width: `${val ?? 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-xxl rounded-xxxl shadow-sm border border-surface-container/50 mb-lg">
              <div className="font-black text-on-surface text-title-md mb-xl flex items-center gap-xs"><span className="text-2xl">🔍</span> Lie Detector Analysis</div>
              <div className="flex items-center gap-xl mb-lg bg-surface-bright p-lg rounded-2xl border border-surface-container">
                <div className="flex-1">
                  <div className="flex justify-between mb-sm">
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Authenticity Score</span>
                    <span className={`text-lg font-black ${result.authenticity_score >= 70 ? 'text-success' : result.authenticity_score >= 50 ? 'text-warning' : 'text-error'}`}>{result.authenticity_score}%</span>
                  </div>
                  <div className="bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${result.authenticity_score >= 70 ? 'bg-success' : result.authenticity_score >= 50 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${result.authenticity_score}%` }} />
                  </div>
                </div>
                <div className="text-5xl drop-shadow-sm">{result.authenticity_score >= 70 ? "✅" : result.authenticity_score >= 50 ? "⚠️" : "❌"}</div>
              </div>
              <div className="flex justify-between items-center p-md bg-surface-bright rounded-xl mb-md border border-surface-container">
                <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Consistency Score</span>
                <span className={`font-black text-lg ${result.consistency_score >= 70 ? 'text-success' : 'text-warning'}`}>{result.consistency_score ?? "—"}%</span>
              </div>
              {result.cheat_count > 0 && (
                <div className="mt-md p-md bg-error/10 border border-error/30 rounded-xl text-sm text-error font-black flex items-center gap-sm">
                  <span className="text-xl">🚨</span> {result.cheat_count} suspicious event{result.cheat_count > 1 ? "s" : ""} flagged during test
                </div>
              )}
              <div className={`mt-sm p-md rounded-xl text-sm font-bold flex items-start gap-sm border ${result.authenticity_score >= 70 ? 'bg-success/10 text-success border-success/20' : result.authenticity_score >= 50 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-error/10 text-error border-error/20'}`}>
                <span className="text-lg leading-none">{result.authenticity_score >= 70 ? "✅" : result.authenticity_score >= 50 ? "⚠️" : "❌"}</span>
                <span>{result.authenticity_score >= 70 ? "Profile appears genuine and consistent. No significant anomalies detected." : result.authenticity_score >= 50 ? "Some inconsistencies detected. A manual review is recommended." : "Significant discrepancies found. High likelihood of misrepresentation."}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
              <div className="glass p-xxl rounded-xxxl shadow-sm border border-surface-container/50">
                <div className="font-black text-on-surface text-title-md mb-xs flex items-center gap-xs"><span className="text-2xl">🕸️</span> Skill Radar Map</div>
                <div className="text-xs font-semibold text-on-surface-variant mb-lg uppercase tracking-wider">Multi-dimensional performance overview</div>
                <div className="bg-surface-bright rounded-2xl p-sm border border-surface-container flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="s" tick={{ fontSize: 11, fill: "#64748B", fontWeight: "700" }} />
                      <Radar name="Score" dataKey="v" stroke="#667EEA" fill="#667EEA" fillOpacity={0.35} strokeWidth={3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-xxl rounded-xxxl shadow-sm border border-surface-container/50 flex flex-col">
                <div className="font-black text-on-surface text-title-md mb-lg flex items-center gap-xs"><span className="text-2xl">🔺</span> Triangle Analysis</div>
                <div className="grid grid-cols-3 gap-sm mb-auto">
                  {([
                    ["Resume", result.ats_score, "text-success"],
                    ["Test", result.test_score, "text-indigo-brand"],
                    ["Interview", result.interview_score, "text-[#A78BFA]"],
                  ] as [string, number, string][]).map(([l, v, c]) => (
                    <div key={l} className="text-center bg-surface-bright rounded-xl p-md border border-surface-container hover:border-surface-container-high transition-colors">
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-xs">{l}</div>
                      <div className={`text-2xl font-black ${c}`}>{v ?? "—"}%</div>
                    </div>
                  ))}
                </div>
                <div className="mt-lg p-md rounded-2xl text-center border-2" style={{ backgroundColor: `${vc}10`, borderColor: `${vc}30` }}>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Triangle Verdict</div>
                  <div className="font-black text-xl" style={{ color: vc }}>{result.triangle_status || result.verdict}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
              {result.key_strengths?.length > 0 && (
                <div className="glass p-xxl rounded-xxxl shadow-sm border border-surface-container/50">
                  <div className="font-black text-on-surface text-title-md mb-lg flex items-center gap-xs"><span className="text-2xl">💪</span> Key Strengths</div>
                  <div className="flex flex-col gap-sm">
                    {result.key_strengths.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-sm p-sm bg-success/5 border border-success/20 rounded-xl">
                        <span className="text-success font-black shrink-0 text-lg leading-none">✅</span>
                        <span className="text-success-dark text-sm font-semibold leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.improvement_plan?.length > 0 && (
                <div className="glass p-xxl rounded-xxxl shadow-sm border border-surface-container/50">
                  <div className="font-black text-on-surface text-title-md mb-lg flex items-center gap-xs"><span className="text-2xl">🎯</span> Improvement Plan</div>
                  <div className="flex flex-col gap-sm">
                    {result.improvement_plan.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-sm p-sm bg-warning/5 border border-warning/20 rounded-xl">
                        <span className="text-warning font-black shrink-0 text-lg leading-none">📌</span>
                        <span className="text-warning-dark text-sm font-semibold leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {result.salary_min > 0 && (
              <div className="glass p-xl rounded-xxxl shadow-sm border border-success/30 bg-success/5 text-center mb-lg">
                <div className="font-black text-success text-title-md mb-xs">💰 Estimated Salary Range</div>
                <div className="text-4xl font-black text-success drop-shadow-sm my-xs">₹{result.salary_min}L – ₹{result.salary_max}L/yr</div>
                <div className="text-xs font-semibold text-success/80 uppercase tracking-wider">Based on your overall score, role, and market data</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-md justify-center py-lg border-t border-surface-container">
              <button onClick={downloadPDF} className="px-xxl py-md bg-gradient-to-r from-indigo-brand to-[#764BA2] text-white border-none rounded-xl font-black text-body-base cursor-pointer hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-sm">
                <span className="text-xl">📄</span> Download PDF Report
              </button>
              <button onClick={() => { setStep(1); setResult(null); setPitch(""); setAudioBlob(null); setVideoBlob(null); setVideoMode("idle"); setResumeText(""); setSkills(""); setAtsScore(0); }} className="px-xxl py-md bg-surface-bright text-on-surface border-2 border-surface-container rounded-xl font-black text-body-base cursor-pointer hover:border-surface-container-high hover:bg-surface-container/50 transition-all flex items-center justify-center gap-sm">
                <span className="text-xl">🔄</span> Start New Assessment
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="max-w-[1400px] w-full mx-auto mt-xxxl p-lg flex flex-col md:flex-row items-center justify-between border-t border-surface-container/50 pt-xl animate-[fadeIn_0.5s_ease]">
          <div className="flex items-center gap-md mb-md md:mb-0">
            <img src="https://ui-avatars.com/api/?name=Mohamed+Jabri+J+S&background=1E293B&color=D4AF37&size=150" alt="Mohamed Jabri J S" className="w-12 h-12 rounded-full object-cover ring-2 ring-accent-gold/40 shadow-sm hover:scale-105 transition-transform" />
            <div>
              <div className="text-body-base font-black text-on-surface">Mohamed Jabri J S</div>
              <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Founder &amp; CEO, GenuAI Technologies</div>
            </div>
          </div>
          <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">copyright</span> {new Date().getFullYear()} GenuAI Technologies.
          </div>
        </div>
      </div>
    </div>
  );
};
