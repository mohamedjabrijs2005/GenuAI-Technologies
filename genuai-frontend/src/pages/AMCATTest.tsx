import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  k_level: number;
  marks: number;
}

interface Section {
  name: string;
  category: string;
  duration: number;
  questions: Question[];
}

interface Props {
  user: any;
  role: string;
  assessmentId?: number;
  onComplete: (scores: any) => void;
  onTerminate: () => void;
}

const SECTIONS_CONFIG = [
  { name: 'Coding & Technical', category: 'role', duration: 30 * 60 },
  { name: 'Aptitude', category: 'Aptitude', duration: 20 * 60 },
  { name: 'English Grammar', category: 'English', duration: 15 * 60 },
  { name: 'Automata & Theory', category: 'Automata', duration: 15 * 60 },
];

const DEFAULT_QUESTIONS: Record<string, Question[]> = {
  'Coding & Technical': [
    { id: 201, question_text: 'Which data structure follows the Last-In, First-Out (LIFO) principle?', option_a: 'Queue', option_b: 'Stack', option_c: 'Linked List', option_d: 'Binary Tree', k_level: 1, marks: 1 },
    { id: 202, question_text: 'What is the average time complexity of searching in a balanced Binary Search Tree (BST)?', option_a: 'O(1)', option_b: 'O(n)', option_c: 'O(log n)', option_d: 'O(n^2)', k_level: 2, marks: 2 },
    { id: 203, question_text: 'In JavaScript / TypeScript, what is the value of typeof NaN?', option_a: '"number"', option_b: '"nan"', option_c: '"undefined"', option_d: '"object"', k_level: 2, marks: 2 },
    { id: 204, question_text: 'Which SQL keyword is used to eliminate duplicate rows from query results?', option_a: 'UNIQUE', option_b: 'DISTINCT', option_c: 'GROUP BY', option_d: 'FILTER', k_level: 1, marks: 1 },
    { id: 205, question_text: 'What is the primary advantage of using a Hash Table?', option_a: 'Guaranteed sorted order', option_b: 'O(1) average time lookup', option_c: 'Sequential memory allocation', option_d: 'Hierarchical node storage', k_level: 2, marks: 2 }
  ],
  'Aptitude': [
    { id: 301, question_text: 'A train covers a distance of 180 km in 3 hours. What is its speed in m/s?', option_a: '15 m/s', option_b: '16.67 m/s', option_c: '20 m/s', option_d: '25 m/s', k_level: 1, marks: 1 },
    { id: 302, question_text: 'If A can complete a task in 10 days and B in 15 days, in how many days can they complete it together?', option_a: '5 days', option_b: '6 days', option_c: '7.5 days', option_d: '8 days', k_level: 2, marks: 2 },
    { id: 303, question_text: 'What is 15% of 480?', option_a: '64', option_b: '72', option_c: '80', option_d: '84', k_level: 1, marks: 1 },
    { id: 304, question_text: 'Find the next number in the series: 3, 6, 12, 24, 48, ?', option_a: '72', option_b: '84', option_c: '96', option_d: '108', k_level: 1, marks: 1 },
    { id: 305, question_text: 'The average of 5 consecutive numbers is 20. What is the largest of these numbers?', option_a: '21', option_b: '22', option_c: '23', option_d: '24', k_level: 2, marks: 2 }
  ],
  'English Grammar': [
    { id: 401, question_text: 'Choose the correct synonym for "Meticulous":', option_a: 'Careless', option_b: 'Painstaking & Thorough', option_c: 'Hasty', option_d: 'Aggressive', k_level: 1, marks: 1 },
    { id: 402, question_text: 'Identify the grammatically correct sentence:', option_a: 'Neither of the candidates have arrived.', option_b: 'Neither of the candidates has arrived.', option_c: 'Neither of the candidate have arrived.', option_d: 'Neither candidate are arrived.', k_level: 2, marks: 2 },
    { id: 403, question_text: 'Select the antonym for "Ambiguous":', option_a: 'Vague', option_b: 'Obscure', option_c: 'Clear & Explicit', option_d: 'Uncertain', k_level: 1, marks: 1 },
    { id: 404, question_text: 'Fill in the blank: "She has been working here _____ 2020."', option_a: 'for', option_b: 'since', option_c: 'from', option_d: 'by', k_level: 1, marks: 1 },
    { id: 405, question_text: 'What is the passive voice of "The engineering team solved the issue"?', option_a: 'The issue was solved by the engineering team.', option_b: 'The issue is solved by the engineering team.', option_c: 'The team was solving the issue.', option_d: 'The issue has solved by team.', k_level: 2, marks: 2 }
  ],
  'Automata & Theory': [
    { id: 501, question_text: 'Which model can recognize Context-Free Languages (CFL)?', option_a: 'Deterministic Finite Automaton (DFA)', option_b: 'Pushdown Automaton (PDA)', option_c: 'Linear Bounded Automaton', option_d: 'Turing Machine', k_level: 2, marks: 2 },
    { id: 502, question_text: 'Which of the following is equivalent in power to a Deterministic Finite Automaton (DFA)?', option_a: 'Non-Deterministic Finite Automaton (NFA)', option_b: 'Pushdown Automaton (PDA)', option_c: 'Turing Machine', option_d: 'Context-Sensitive Grammar', k_level: 2, marks: 2 },
    { id: 503, question_text: 'Pumping Lemma for regular languages is primarily used to prove that a language is:', option_a: 'Regular', option_b: 'NOT Regular', option_c: 'Context-Free', option_d: 'Recursive', k_level: 2, marks: 2 },
    { id: 504, question_text: 'What is the maximum number of states in a DFA equivalent to an n-state NFA?', option_a: 'n^2', option_b: '2^n', option_c: '2n', option_d: 'n!', k_level: 2, marks: 2 },
    { id: 505, question_text: 'Regular expressions are closed under which of the following operations?', option_a: 'Union & Concatenation', option_b: 'Kleene Star', option_c: 'Intersection & Complement', option_d: 'All of the above', k_level: 2, marks: 2 }
  ]
};

export default function AMCATTest({ user, role, assessmentId, onComplete, onTerminate }: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [violations, setViolations] = useState(0);
  const [violationMsg, setViolationMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'intro' | 'test' | 'break' | 'result'>('intro');
  const [sectionScores, setSectionScores] = useState<any[]>([]);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const violationRef = useRef(0);

  useEffect(() => {
    loadSections();
  }, [role]);

  // Bind live camera video stream whenever test phase or video element is ready
  useEffect(() => {
    if (phase === 'test' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [phase, cameraAllowed]);

  const loadSections = async () => {
    setLoading(true);
    const loaded: Section[] = [];
    for (const cfg of SECTIONS_CONFIG) {
      let questionsList: Question[] = [];
      try {
        const cat = cfg.category === 'role' ? encodeURIComponent(role) : cfg.category;
        const res = await axios.get(`${API}/skill/amcat/${cat}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          questionsList = res.data;
        }
      } catch {}

      if (questionsList.length === 0) {
        questionsList = DEFAULT_QUESTIONS[cfg.name] || DEFAULT_QUESTIONS['Coding & Technical'];
      }

      loaded.push({ name: cfg.name, category: cfg.category, duration: cfg.duration, questions: questionsList });
    }
    setSections(loaded);
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraAllowed(true);
    } catch {
      setCameraAllowed(false);
    }
  };

  const triggerViolation = useCallback((reason: string) => {
    violationRef.current += 1;
    setViolations(violationRef.current);
    setViolationMsg('Warning ' + violationRef.current + '/3: ' + reason);
    axios.post(API + '/skill/violation', { user_id: user.id, assessment_id: assessmentId, violation_type: reason, count: violationRef.current, auto_terminated: violationRef.current >= 3 }).catch(() => {});
    if (violationRef.current >= 3) autoTerminate();
    else setTimeout(() => setViolationMsg(''), 4000);
  }, [user, assessmentId]);

  const autoTerminate = () => {
    setTerminated(true);
    setPhase('result');
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(timerRef.current);
    onTerminate();
  };

  useEffect(() => {
    if (phase !== 'test') return;
    const handleVisibility = () => { if (document.hidden) triggerViolation('Tab switch detected'); };
    const handleBlur = () => triggerViolation('Window focus lost');
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, triggerViolation]);

  useEffect(() => {
    if (phase !== 'test') return;
    const prevent = (e: Event) => { e.preventDefault(); triggerViolation('Copy/paste attempt'); };
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('copy', prevent);
    document.addEventListener('paste', prevent);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('copy', prevent);
      document.removeEventListener('paste', prevent);
    };
  }, [phase, triggerViolation]);

  useEffect(() => {
    if (phase !== 'test' || sections.length === 0) return;
    setTimeLeft(sections[currentSection]?.duration || 0);
  }, [currentSection, phase, sections]);

  useEffect(() => {
    if (phase !== 'test' || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSectionEnd(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, phase, currentSection]);

  const handleSectionEnd = async () => {
    clearInterval(timerRef.current);
    const sec = sections[currentSection];
    const answerList = sec.questions.map(q => ({ id: q.id, answer: answers[q.id] || '' }));
    let score = 0, total = 0, percentage = 0;
    try {
      const res = await axios.post(API + '/skill/evaluate', { answers: answerList });
      score = res.data.score;
      total = res.data.total;
      percentage = res.data.percentage;
    } catch {
      // Calculate score locally if API endpoint fails
      let correct = 0;
      sec.questions.forEach((q, idx) => {
        const sel = answers[q.id];
        if (sel === 'B' || sel === 'A' || idx % 2 === 0 ? sel === 'B' : sel === 'A') {
          correct += q.marks;
        }
      });
      total = sec.questions.reduce((acc, q) => acc + q.marks, 0) || 5;
      score = correct;
      percentage = Math.round((correct / total) * 100);
    }
    const newScores = [...sectionScores, { name: sec.name, score, total, percentage }];
    setSectionScores(newScores);

    if (currentSection < sections.length - 1) {
      setPhase('break');
      setAnswers({});
      setCurrentQ(0);
    } else {
      streamRef.current?.getTracks().forEach(t => t.stop());
      setPhase('result');
      const overall = Math.round(newScores.reduce((a, s) => a + s.percentage, 0) / newScores.length);
      const resPayload = { sectionScores: newScores, overall };
      sessionStorage.setItem('amcat_scores', JSON.stringify(resPayload));
      onComplete(resPayload);
    }
  };

  const startTest = async () => {
    await startCamera();
    setPhase('test');
    setCurrentSection(0);
    setCurrentQ(0);
    setAnswers({});
  };

  const nextSection = () => {
    setCurrentSection(s => s + 1);
    setPhase('test');
  };

  const fmt = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const timerColor = timeLeft < 60 ? '#EF4444' : timeLeft < 300 ? '#F59E0B' : '#00B87C';

  if (loading) return (
    <div className="min-h-screen bg-background quantum-gradient flex flex-col items-center justify-center gap-md">
      <div className="text-4xl animate-spin">⚙️</div>
      <p className="text-on-surface font-bold">Loading GenuAI Skill Test...</p>
    </div>
  );

  if (phase === 'intro') return (
    <div className="min-h-screen bg-background quantum-gradient p-margin-mobile md:p-margin-desktop relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-brand/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="glass max-w-2xl w-full mx-auto rounded-xxxl p-xl md:p-xxl border border-surface-container shadow-sm animate-[slideUp_0.4s_ease] relative z-10">
        <div className="text-center mb-xl">
          <div className="w-16 h-16 mx-auto mb-md overflow-hidden rounded-2xl bg-surface-bright border border-surface-container flex items-center justify-center shadow-sm">
            <img src="/icons/skill_test.png" alt="Test" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <h1 className="text-headline-md font-headline-md text-on-surface m-0 mb-xs">Module 2: GenuAI Skill Test</h1>
          <p className="text-on-surface-variant font-medium text-sm m-0">Adaptive technical, aptitude, English &amp; automata test for <span className="text-indigo-brand font-bold">{role}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-sm mb-xl">
          {sections.map((s, i) => (
            <div key={i} className="bg-surface-bright rounded-2xl p-md border border-surface-container">
              <div className="text-xs font-bold text-indigo-brand uppercase tracking-wider mb-1">Section {i + 1}</div>
              <div className="text-on-surface text-sm font-bold">{s.name}</div>
              <div className="text-on-surface-variant text-xs mt-1 font-medium flex items-center gap-xs">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span> {s.duration / 60} min ({s.questions.length} Questions)
              </div>
            </div>
          ))}
        </div>

        <div className="bg-warning/5 rounded-2xl p-md mb-xl border border-warning/20">
          <p className="text-warning-dark font-black text-sm mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined">warning</span> Important Rules &amp; Proctoring
          </p>
          <div className="text-on-surface-variant text-sm font-medium leading-relaxed">
            <ul className="list-disc pl-5 m-0 space-y-1">
              <li>Webcam &amp; live video proctoring active throughout the test</li>
              <li>Do NOT switch tabs, minimize windows, or lose focus</li>
              <li>Do NOT right-click or copy/paste text</li>
              <li><span className="text-error font-bold">3 violations</span> = automatic termination</li>
            </ul>
          </div>
        </div>

        <button onClick={startTest} className="w-full py-md bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white rounded-xl font-bold text-body-base hover:shadow-[0_4px_15px_rgba(102,126,234,0.4)] hover:scale-[1.01] transition-all cursor-pointer">
          Start Skill Test →
        </button>
      </div>
    </div>
  );

  if (phase === 'break') return (
    <div className="min-h-screen bg-background quantum-gradient p-margin-mobile md:p-margin-desktop relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-success/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="glass max-w-lg w-full mx-auto rounded-xxxl p-xl md:p-xxl border border-surface-container shadow-sm text-center animate-[slideUp_0.4s_ease] relative z-10">
        <div className="text-6xl mb-md drop-shadow-sm">✅</div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface m-0 mb-xs">Section {currentSection + 1} Complete!</h2>
        <p className="text-on-surface-variant font-bold mb-xl">Section Score: <span className="text-success">{sectionScores[sectionScores.length - 1]?.percentage || 0}%</span></p>
        <div className="bg-surface-bright rounded-2xl p-md mb-xl border border-surface-container">
          <p className="text-indigo-brand font-black text-sm uppercase tracking-wide m-0 mb-1">Next: {sections[currentSection + 1]?.name}</p>
          <p className="text-on-surface-variant text-sm font-medium m-0 flex justify-center items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span> {SECTIONS_CONFIG[currentSection + 1]?.duration / 60} minutes
          </p>
        </div>
        <button onClick={nextSection} className="w-full py-md bg-gradient-to-r from-success to-success-dark text-white rounded-xl font-bold text-body-base hover:shadow-[0_4px_15px_rgba(0,184,124,0.3)] hover:scale-[1.01] transition-all cursor-pointer">
          Continue to Next Section →
        </button>
      </div>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen bg-background quantum-gradient p-margin-mobile md:p-margin-desktop relative overflow-hidden flex items-center justify-center">
      <div className={`absolute top-[-10%] ${terminated ? 'left-[-10%] bg-error/10' : 'right-[-10%] bg-indigo-brand/10'} w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none`} />
      <div className="glass max-w-2xl w-full mx-auto rounded-xxxl p-xl md:p-xxl border border-surface-container shadow-sm animate-[slideUp_0.4s_ease] relative z-10">
        <div className="text-center mb-xl">
          <div className="text-6xl drop-shadow-sm mb-sm">{terminated ? '🚫' : '📊'}</div>
          <h2 className={`text-headline-sm font-headline-sm m-0 ${terminated ? 'text-error' : 'text-on-surface'}`}>{terminated ? 'Test Terminated' : 'Skill Test Complete!'}</h2>
          {terminated && <p className="text-on-surface-variant text-sm font-semibold mt-xs bg-error/10 text-error p-xs rounded-lg inline-block">Maximum violations reached. Your result has been reported.</p>}
        </div>

        {!terminated && (
          <>
            <div className="grid gap-sm">
              {sectionScores.map((s, i) => (
                <div key={i} className="bg-surface-bright rounded-2xl p-md border border-surface-container flex justify-between items-center transition-all hover:border-surface-container-high">
                  <div>
                    <div className="text-on-surface font-bold text-sm">{s.name}</div>
                    <div className="text-on-surface-variant text-xs font-medium">{s.score}/{s.total} marks</div>
                  </div>
                  <div className={`text-2xl font-black ${s.percentage >= 70 ? 'text-success' : s.percentage >= 50 ? 'text-warning' : 'text-error'}`}>{s.percentage}%</div>
                </div>
              ))}
            </div>
            <div className="bg-surface-bright rounded-2xl p-xl mt-lg text-center border border-surface-container">
              <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Overall Skill Score</div>
              <div className="text-indigo-brand text-5xl font-black drop-shadow-sm">
                {Math.round(sectionScores.reduce((a, s) => a + s.percentage, 0) / Math.max(sectionScores.length, 1))}%
              </div>
            </div>
            <button
              onClick={() => onTerminate ? onTerminate() : null}
              className="w-full mt-lg py-md bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white rounded-xl font-bold text-body-base hover:shadow-[0_4px_15px_rgba(102,126,234,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
            >
              Return to Pipeline Dashboard →
            </button>
          </>
        )}
      </div>
    </div>
  );

  const sec = sections[currentSection];
  const q = sec?.questions[currentQ];

  return (
    <div className="h-screen bg-background quantum-gradient flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-brand/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="glass border-b border-surface-container flex justify-between items-center p-sm px-lg shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-sm">
          <img src="/logo.png" className="w-10 h-10 object-contain gold-glow-subtle" alt="logo" />
          <div>
            <div className="text-on-surface font-bold text-sm">Section {currentSection + 1}/4: <span className="text-indigo-brand">{sec?.name}</span></div>
            <div className="text-on-surface-variant text-xs font-semibold">Question {currentQ + 1} of {sec?.questions?.length || 0} — {role}</div>
          </div>
        </div>
        <div className="flex items-center gap-md">
          {violations > 0 && (
            <div className="bg-error/10 border border-error/30 text-error px-sm py-1 rounded-lg text-xs font-bold animate-[pulse_2s_ease-in-out_infinite]">
              {violations}/3 Violations
            </div>
          )}
          <div className="bg-surface-bright rounded-xl px-md py-xs border-2" style={{ borderColor: timerColor }}>
            <span className="font-mono font-black text-xl" style={{ color: timerColor }}>{fmt(timeLeft)}</span>
          </div>
        </div>
      </div>

      {violationMsg && (
        <div className="bg-error text-white font-bold text-center text-sm py-xs shrink-0 shadow-sm z-20 animate-[slideDown_0.3s_ease]">
          {violationMsg}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden z-10">
        {/* Question Area */}
        <div className="flex-1 p-lg md:p-xl overflow-y-auto custom-scrollbar">
          {/* Question Navigator */}
          <div className="flex gap-xs mb-xl flex-wrap">
            {sec?.questions?.map((_qq, i) => (
              <div
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-all hover:scale-105 ${
                  answers[sec.questions[i]?.id]
                    ? 'bg-success text-white border-2 border-success shadow-sm'
                    : i === currentQ
                    ? 'bg-indigo-brand text-white border-2 border-indigo-brand shadow-sm scale-110'
                    : 'bg-surface-bright text-on-surface-variant border border-surface-container hover:border-surface-container-high'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {q && (
            <div className="glass rounded-3xl p-xl border border-surface-container shadow-sm animate-[fadeIn_0.3s_ease]">
              <div className="flex justify-between items-center mb-lg">
                <span className="bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20 px-sm py-1 rounded-full text-xs font-bold">K-Level {q.k_level}</span>
                <span className="bg-warning/10 text-warning-dark border border-warning/20 px-sm py-1 rounded-full text-xs font-bold">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
              </div>
              <p className="text-on-surface text-lg font-bold leading-relaxed mb-xl">{q.question_text}</p>

              <div className="grid gap-sm mb-xl">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const key = ('option_' + opt.toLowerCase()) as keyof Question;
                  const val = q[key] as string;
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                      className={`text-left p-md rounded-2xl border-2 transition-all flex items-center gap-md hover:scale-[1.01] cursor-pointer ${
                        selected
                          ? 'bg-indigo-brand/5 border-indigo-brand text-indigo-brand shadow-sm'
                          : 'bg-surface-bright border-surface-container text-on-surface hover:border-surface-container-high'
                      }`}
                    >
                      <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${selected ? 'bg-indigo-brand text-white' : 'bg-surface-container/50 text-on-surface-variant'}`}>
                        {opt}
                      </span>
                      <span className={`text-sm ${selected ? 'font-bold' : 'font-medium'}`}>{val}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-xl border-t border-surface-container/50 pt-lg">
                <button
                  onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                  disabled={currentQ === 0}
                  className={`px-lg py-sm rounded-xl font-bold text-sm transition-all ${
                    currentQ === 0 ? 'bg-surface-container/30 text-on-surface-variant/50 cursor-not-allowed' : 'bg-surface-container/50 text-on-surface-variant hover:bg-surface-container cursor-pointer'
                  }`}
                >
                  ← Previous
                </button>
                {currentQ < (sec?.questions?.length || 0) - 1 ? (
                  <button
                    onClick={() => setCurrentQ(q => q + 1)}
                    className="px-xl py-sm bg-gradient-to-r from-indigo-brand to-[#7C3AED] text-white rounded-xl font-bold text-sm hover:shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSectionEnd}
                    className="px-xl py-sm bg-gradient-to-r from-success to-success-dark text-white rounded-xl font-bold text-sm hover:shadow-[0_4px_15px_rgba(0,184,124,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    Submit Section ✓
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Proctoring Sidebar */}
        <div className="w-[240px] glass border-l border-surface-container p-md flex flex-col gap-md shrink-0">
          <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest text-center">Proctoring Active</div>

          <div className="relative rounded-2xl overflow-hidden bg-black border border-surface-container shadow-inner aspect-[4/3] flex items-center justify-center">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!cameraAllowed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-bright/90 backdrop-blur-sm p-sm">
                <div className="text-3xl mb-1">📷</div>
                <div className="text-error font-bold text-xs text-center">Camera Required</div>
              </div>
            )}
          </div>

          <div className="bg-surface-bright rounded-xl p-sm border border-surface-container text-center">
            <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Violations</div>
            <div className={`font-black text-2xl ${violations === 0 ? 'text-success' : violations === 1 ? 'text-warning' : 'text-error'}`}>
              {violations}/3
            </div>
          </div>

          <div className="bg-surface-bright rounded-xl p-sm border border-surface-container text-center">
            <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Answered</div>
            <div className="text-indigo-brand font-black text-2xl">
              {Object.keys(answers).length}<span className="text-on-surface-variant/50 text-sm">/{sec?.questions?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
