import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Props { user: any; onBack: () => void; }

const ROLES = ["Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer","Data Scientist","AI Engineer","DevOps Engineer","Product Manager","UI/UX Designer","Data Analyst"];
const TYPES = [
  { key:"HR",         label:"HR Round",       emoji:"👔", desc:"Personal, background & motivation questions" },
  { key:"Technical",  label:"Technical Round", emoji:"💻", desc:"Coding, system design & tech concepts" },
  { key:"Behavioral", label:"Behavioral Round",emoji:"🧠", desc:"Situation-based & soft skill questions" },
];

const QUESTION_BANK: Record<string, Record<string, string[]>> = {
  HR: {
    default: [
      "Tell me about yourself, your background, and why you are interested in this role.",
      "What is your greatest professional accomplishment so far, and why?",
      "Describe a situation where you experienced a disagreement with a colleague or lead. How did you handle it?",
      "Where do you see yourself in 3 years in your career progression?",
      "Why do you feel GenuAI hiring partners would be a great fit for your skill set?"
    ]
  },
  Technical: {
    "Software Engineer": [
      "Explain the key architectural differences between monolithic vs microservices architectures and when you would choose each.",
      "How do you handle race conditions and concurrency issues when designing high-throughput web applications?",
      "Describe how database indexing works internally (B-Trees vs Hash indexes) and how to optimize slow SQL queries.",
      "Walk through how you design RESTful APIs vs GraphQL APIs, focusing on caching and payload efficiency.",
      "Explain how memory management and garbage collection work in modern execution runtimes."
    ],
    "Frontend Developer": [
      "How do you optimize render performance, virtual DOM diffing, and bundle size in React applications?",
      "Explain how browser event bubbling, capturing, and event delegation work with examples.",
      "How do you approach Responsive Design, CSS Grid/Flexbox layouts, and cross-device accessibility (a11y)?",
      "Describe how client-side caching, Service Workers, and Progressive Web Apps (PWAs) function.",
      "What strategies do you use for global state management (Zustand, Redux, React Context)?"
    ],
    "Backend Developer": [
      "How do you design a resilient message queue architecture using Kafka or RabbitMQ?",
      "Explain JWT authentication vs Session-based authentication, including security considerations (XSS, CSRF).",
      "How do you handle database migrations with zero downtime in production environments?",
      "Describe rate limiting algorithms (Token Bucket, Leaky Bucket) and how to implement them at the API Gateway level.",
      "What approaches do you take for distributed tracing and monitoring in microservices?"
    ],
    "Full Stack Developer": [
      "Walk through an end-to-end user request lifecycle from DNS lookup to database query and browser rendering.",
      "How do you structure your frontend and backend codebases for maximum reusability and clean architecture?",
      "What is your strategy for automated testing (Unit, Integration, E2E) across the stack?",
      "How do you secure web applications against OWASP Top 10 vulnerabilities?",
      "Explain how WebSockets vs Server-Sent Events (SSE) vs HTTP Polling differ for real-time features."
    ],
    default: [
      "Describe a challenging technical problem you solved recently and the trade-offs you considered.",
      "How do you ensure code quality, maintainability, and proper documentation in a fast-moving team?",
      "Explain how modern web frameworks handle routing, state management, and asynchronous data fetching.",
      "What is your approach to debugging production issues when server logs are incomplete?",
      "How do you design APIs that are backwards-compatible and easy for other developers to consume?"
    ]
  },
  Behavioral: {
    default: [
      "Tell me about a time when a project deadline was at risk. What steps did you take to deliver successfully?",
      "Describe a situation where you had to quickly adapt to a major technical shift or unexpected requirement change.",
      "Give an example of a mistake you made in a previous project. What went wrong and what did you learn?",
      "How do you handle receiving critical feedback on your work during code reviews?",
      "Describe a time when you mentored or assisted a fellow developer to overcome a blocker."
    ]
  }
};

function getFallbackQuestion(role: string, type: string, previousQs: string[]): string {
  const category = QUESTION_BANK[type] || QUESTION_BANK.HR;
  const list = category[role] || category.default || QUESTION_BANK.HR.default;
  const unasked = list.filter(q => !previousQs.includes(q));
  if (unasked.length > 0) {
    return unasked[Math.floor(Math.random() * unasked.length)];
  }
  return list[previousQs.length % list.length];
}

function getFallbackEvaluation(question: string, answer: string, role: string) {
  const words = answer.trim().split(/\s+/).length;
  let score = 75;
  let rating = "Good Response";
  const strengths = ["Clear articulation of concepts", "Directly addressed the question prompt"];
  const improvements = ["Quantify metrics and business outcomes where possible", "Use the STAR method (Situation, Task, Action, Result) for deeper structure"];

  if (words > 40) {
    score = Math.min(95, 82 + Math.floor(Math.random() * 10));
    rating = "Strong Answer";
    strengths.push("Detailed technical explanation with great structure");
  } else if (words < 15) {
    score = 62;
    rating = "Needs Elaboration";
    improvements.unshift("Provide more specific technical examples and elaboration");
  }

  return {
    score,
    rating,
    strengths,
    improvements,
    ideal_answer: `A comprehensive answer for a ${role} would clearly describe the approach, key trade-offs considered, and measurable impact achieved.`
  };
}

async function generateQuestion(role: string, type: string, previousQs: string[]): Promise<string> {
  const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
  if (GROQ_KEY) {
    try {
      const prev = previousQs.length ? `Avoid repeating these: ${previousQs.slice(-3).join("; ")}` : "";
      const prompt = `Generate ONE ${type} interview question for a ${role} candidate. ${prev} Return ONLY the question text, nothing else. Make it a realistic, challenging interview question.`;
      const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8, max_tokens: 120
      }, { headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" }, timeout: 6000 });
      if (res.data?.choices?.[0]?.message?.content) {
        return res.data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.warn("Groq API question generation unavailable, using fallback question generator:", e);
    }
  }
  return getFallbackQuestion(role, type, previousQs);
}

async function evaluateAnswer(question: string, answer: string, role: string): Promise<any> {
  const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
  if (GROQ_KEY) {
    try {
      const prompt = `You are a strict interviewer evaluating a ${role} candidate.
Question: "${question}"
Candidate Answer: "${answer}"
Rate this answer and return ONLY valid JSON:
{"score":85,"rating":"Good","strengths":["point1","point2"],"improvements":["point1"],"ideal_answer":"Brief ideal answer in 2 sentences."}`;
      const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3, max_tokens: 400
      }, { headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" }, timeout: 6000 });
      if (res.data?.choices?.[0]?.message?.content) {
        return JSON.parse(res.data.choices[0].message.content);
      }
    } catch (e) {
      console.warn("Groq API answer evaluation unavailable, using fallback evaluator:", e);
    }
  }
  return getFallbackEvaluation(question, answer, role);
}

export default function AIMockInterview({ user, onBack }: Props) {
  const [phase, setPhase] = useState<"setup"|"interview"|"results">("setup");
  const [role, setRole] = useState("Software Engineer");
  const [type, setType] = useState("HR");
  const [questionCount, setQuestionCount] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  
  const [history, setHistory] = useState<{q:string;a:string;fb:any}[]>([]);
  const [qIndex, setQIndex] = useState(0);
  
  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        
        // Throttled update to prevent mobile re-render lagging
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(() => {
          setAnswer(current);
        });
      };
      
      recognitionRef.current.onerror = (e: any) => {
        console.error('Speech recognition error', e.error);
        if (e.error === 'not-allowed') alert("Microphone access denied.");
        setIsRecording(false);
      };
    }
    return () => {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e){}
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const startInterview = async () => {
    setLoading(true);
    setHistory([]); setQIndex(0); setFeedback(null); setAnswer("");
    try {
      const q = await generateQuestion(role, type, []);
      setCurrentQ(q);
      setPhase("interview");
    } catch {
      const q = getFallbackQuestion(role, type, []);
      setCurrentQ(q);
      setPhase("interview");
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    if (isRecording) stopVoice();
    window.speechSynthesis.cancel();
    
    setLoading(true);
    try {
      const fb = await evaluateAnswer(currentQ, answer, role);
      setFeedback(fb);
    } catch { 
      setFeedback(getFallbackEvaluation(currentQ, answer, role)); 
    }
    setLoading(false);
  };

  const nextQuestion = async () => {
    const newHistory = [...history, { q: currentQ, a: answer, fb: feedback }];
    setHistory(newHistory);
    if (newHistory.length >= questionCount) { setPhase("results"); return; }
    
    setLoading(true);
    setAnswer(""); setFeedback(null);
    try {
      const q = await generateQuestion(role, type, newHistory.map(h => h.q));
      setCurrentQ(q);
      setQIndex(i => i + 1);
    } catch {
      const q = getFallbackQuestion(role, type, newHistory.map(h => h.q));
      setCurrentQ(q);
      setQIndex(i => i + 1);
    }
    setLoading(false);
  };

  const startVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome/Edge or type your answer.");
      return;
    }
    setAnswer("");
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch(e){}
  };

  const stopVoice = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
    } catch(e){}
  };

  const readQuestionAloud = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentQ);
    u.rate = 0.95;
    u.onstart = () => setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const avgScore = history.length ? Math.round(history.reduce((s, h) => s + (h.fb?.score || 0), 0) / history.length) : 0;
  
  // ── SETUP PHASE ──
  if (phase === "setup") return (
    <div className="min-h-screen bg-background quantum-gradient font-body-base text-on-background relative overflow-x-hidden flex flex-col">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-accent-gold/10 blur-[60px] sm:blur-[120px] rounded-full pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-indigo-brand/10 blur-[60px] sm:blur-[120px] rounded-full pointer-events-none transform-gpu" />
      
      {/* Responsive Header */}
      <div className="relative z-10 glass border-b border-surface-container/50 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors font-bold text-xs sm:text-sm shrink-0">
          <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
          <span className="hidden sm:inline">Back to Practice Hub</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="font-black text-on-surface text-sm sm:text-lg flex items-center gap-1.5 truncate">
          <span className="material-symbols-outlined text-accent-gold text-lg sm:text-xl shrink-0">smart_toy</span>
          <span className="truncate">AI Mock Interview</span>
        </div>
        <div className="w-8 sm:w-20"></div>
      </div>

      {/* Setup Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-12 gap-6 sm:gap-8 items-center justify-center">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left space-y-4">
          <div className="text-5xl sm:text-7xl mb-2 animate-[float_4s_ease-in-out_infinite]">🤖</div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight">
            Master Your Next<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-brand via-purple-500 to-cyan-500">Technical Interview</span>
          </h1>
          <p className="text-xs sm:text-base text-on-surface-variant/90 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience a hyper-realistic, AI-driven interview environment. Utilize live voice transcription and receive instantaneous, actionable feedback on every response.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 pt-2">
             <div className="glass px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-indigo-brand flex items-center gap-1.5 shadow-xs border border-indigo-brand/20">
               <span className="material-symbols-outlined text-base">mic</span> Live Speech-to-Text
             </div>
             <div className="glass px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-success flex items-center gap-1.5 shadow-xs border border-success/20">
               <span className="material-symbols-outlined text-base">bolt</span> Instant AI Grading
             </div>
          </div>
        </div>
        
        {/* Right Content - Config Card */}
        <div className="flex-1 max-w-[500px] w-full">
          <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-surface-container relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <h2 className="text-lg sm:text-xl font-black text-on-surface">Configure Session</h2>
              
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1 tracking-widest uppercase">Your Target Role</label>
                <div className="relative">
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full appearance-none bg-surface-bright border border-surface-container rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-on-surface font-semibold focus:outline-none focus:border-indigo-brand focus:ring-1 focus:ring-indigo-brand transition-colors cursor-pointer pr-8">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">expand_more</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-2 tracking-widest uppercase">Interview Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map(t => (
                    <div key={t.key} onClick={() => setType(t.key)} className={`p-2 sm:p-3 rounded-xl border-2 cursor-pointer text-center transition-all duration-200 ${type === t.key ? "border-indigo-brand bg-indigo-brand/5 shadow-xs transform -translate-y-0.5" : "border-surface-container bg-surface-bright hover:border-slate-300"}`}>
                      <div className="text-xl sm:text-2xl mb-1">{t.emoji}</div>
                      <div className={`font-bold text-[11px] sm:text-xs ${type === t.key ? "text-indigo-brand" : "text-on-surface-variant"}`}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Number of Questions</label>
                  <span className="text-indigo-brand font-black text-sm sm:text-base bg-indigo-brand/10 px-2 py-0.5 rounded-md">{questionCount}</span>
                </div>
                <input type="range" min={3} max={10} value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))} className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-indigo-brand" />
              </div>

              <button onClick={startInterview} disabled={loading} className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${loading ? "bg-surface-container text-on-surface-variant cursor-not-allowed" : "bg-gradient-to-r from-indigo-brand to-[#764BA2] text-white hover:shadow-lg active:scale-[0.99]"}`}>
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin text-lg">autorenew</span> Preparing AI...</>
                ) : (
                  <>Start {questionCount}-Question Interview <span className="material-symbols-outlined text-lg">arrow_forward</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULTS PHASE ──
  if (phase === "results") return (
    <div className="min-h-screen bg-background quantum-gradient font-body-base text-on-background relative overflow-x-hidden flex flex-col">
      <div className="relative z-10 glass border-b border-surface-container/50 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="text-4xl sm:text-5xl">🏆</div>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Interview Complete</h1>
          <div className="text-xs sm:text-sm font-bold text-on-surface-variant/80 flex items-center justify-center gap-2">
             <span className="material-symbols-outlined text-base">work</span> {role} • {type} Round
          </div>
          
          <div className="inline-flex items-center gap-4 glass p-4 rounded-2xl border border-surface-container shadow-sm mt-2">
            <span className={`text-3xl sm:text-5xl font-black ${avgScore >= 80 ? "text-success" : avgScore >= 60 ? "text-warning" : "text-error"}`}>{avgScore}%</span>
            <div className="text-left border-l border-surface-container pl-3">
              <div className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Overall Score</div>
              <div className={`font-bold text-xs sm:text-sm ${avgScore >= 80 ? "text-success" : avgScore >= 60 ? "text-warning" : "text-error"}`}>
                {avgScore >= 80 ? "Excellent Performance!" : avgScore >= 60 ? "Good — Keep Practising" : "Needs Improvement"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg sm:text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-gold text-2xl">insights</span>
            Detailed Feedback ({history.length} Questions)
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => { setPhase("setup"); setHistory([]); setQIndex(0); }} className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-brand text-white rounded-xl font-bold text-xs hover:bg-indigo-brand-dark transition-colors shadow-xs flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">refresh</span> New Interview
            </button>
            <button onClick={onBack} className="flex-1 sm:flex-initial px-4 py-2 glass rounded-xl font-bold text-xs text-on-surface hover:bg-surface-container/50 transition-colors border border-surface-container flex items-center justify-center gap-1">
               Exit
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {history.map((h, i) => {
            const isGood = h.fb?.score >= 80;
            const isOk = h.fb?.score >= 60;
            const qColor = isGood ? "text-success" : isOk ? "text-warning" : "text-error";
            const qBg = isGood ? "bg-success/10" : isOk ? "bg-warning/10" : "bg-error/10";
            
            return (
              <div key={i} className="glass rounded-2xl p-4 sm:p-6 border border-surface-container shadow-xs space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Question {i+1}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-on-surface leading-snug">{h.q}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-2xl sm:text-3xl font-black ${qColor}`}>{h.fb?.score || 0}%</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${qBg} ${qColor}`}>{h.fb?.rating}</div>
                  </div>
                </div>
                
                <div className="bg-surface-bright/80 p-3 rounded-xl border border-surface-container/50 text-xs sm:text-sm font-medium text-on-surface-variant italic">
                  "{h.a}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-success/5 rounded-xl p-3 border border-success/20">
                    <div className="text-xs font-black text-success mb-2 uppercase tracking-wider flex items-center gap-1"><span>✅</span> Strengths</div>
                    <ul className="space-y-1 text-xs text-success/90 font-medium">
                      {(h.fb?.strengths||[]).map((s:string,idx:number) => <li key={idx}>• {s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-warning/5 rounded-xl p-3 border border-warning/20">
                    <div className="text-xs font-black text-warning mb-2 uppercase tracking-wider flex items-center gap-1"><span>📈</span> Areas to Improve</div>
                    <ul className="space-y-1 text-xs text-warning/90 font-medium">
                      {(h.fb?.improvements||[]).map((s:string,idx:number) => <li key={idx}>• {s}</li>)}
                    </ul>
                  </div>
                </div>

                {h.fb?.ideal_answer && (
                  <div className="bg-indigo-brand/5 rounded-xl p-3 border border-indigo-brand/20">
                    <div className="text-xs font-black text-indigo-brand mb-1 uppercase tracking-wider flex items-center gap-1"><span>💡</span> Ideal Answer Example</div>
                    <div className="text-xs text-indigo-brand/90 font-medium leading-relaxed">{h.fb.ideal_answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── ACTIVE INTERVIEW PHASE ──
  const progress = ((qIndex) / questionCount) * 100;
  return (
    <div className="min-h-screen lg:h-screen bg-background font-body-base text-on-background flex flex-col overflow-x-hidden lg:overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 quantum-gradient opacity-50 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 glass border-b border-surface-container/50 px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between shrink-0 shadow-xs gap-2">
        <div className="flex items-center gap-2 truncate">
          <div className="font-black text-sm sm:text-base text-on-surface flex items-center gap-1 tracking-tight truncate">
             <span className="material-symbols-outlined text-accent-gold text-lg">smart_toy</span>
             <span className="truncate">GenuAI Interview</span>
          </div>
          <div className="hidden xs:flex bg-indigo-brand/10 border border-indigo-brand/20 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-indigo-brand items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-brand animate-pulse"></span>
            {role} ({type})
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Q{qIndex+1}/{questionCount}</span>
            <div className="w-20 sm:w-32 h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-brand to-cyan-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button onClick={onBack} className="px-2.5 py-1 border border-surface-container text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container hover:text-on-surface transition-colors">
            Exit
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left Pane - Question Card */}
        <div className="w-full lg:w-5/12 glass border-b lg:border-b-0 lg:border-r border-surface-container/50 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 shrink-0">
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] font-black text-indigo-brand uppercase tracking-widest bg-indigo-brand/10 px-2.5 py-1 rounded-md border border-indigo-brand/20">
              {type} Round
            </span>
            <button onClick={readQuestionAloud} disabled={isPlaying} className={`glass px-2.5 py-1 rounded-lg border border-surface-container text-xs font-bold flex items-center gap-1 transition-colors ${isPlaying ? 'text-indigo-brand bg-indigo-brand/5' : 'text-on-surface hover:bg-surface-container'}`}>
              <span className={`material-symbols-outlined text-sm ${isPlaying ? 'animate-pulse' : ''}`}>{isPlaying ? 'volume_up' : 'play_arrow'}</span>
              {isPlaying ? "Speaking..." : "Read Aloud"}
            </button>
          </div>

          <div className="py-4 space-y-2">
             <span className="material-symbols-outlined text-3xl text-indigo-brand/60">help</span>
             <h2 className="text-base sm:text-xl lg:text-2xl font-black text-on-surface leading-snug">{currentQ}</h2>
          </div>

          <div className="text-[11px] text-on-surface-variant font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            💡 Tip: Speak clearly using your microphone or type your response in the editor.
          </div>
        </div>

        {/* Right Pane - Answer / Feedback */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-surface-bright/30 flex flex-col">
          {!feedback ? (
            <div className="glass rounded-2xl border border-surface-container shadow-sm flex flex-col flex-1 min-h-[320px] sm:min-h-[420px]">
              <div className="px-4 py-3 border-b border-surface-container/50 bg-surface-bright/50 rounded-t-2xl flex justify-between items-center">
                <span className="font-bold text-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">edit_document</span> Response Editor
                </span>
                {isRecording && (
                  <span className="text-error text-[11px] font-bold flex items-center gap-1 bg-error/10 px-2 py-0.5 rounded-full border border-error/20">
                    <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping"></span> Live Listening
                  </span>
                )}
              </div>
              
              <textarea 
                value={answer} 
                onChange={e => setAnswer(e.target.value)} 
                placeholder="Type your answer here, or click 'Live Voice Answer' to speak it..." 
                className="flex-1 bg-transparent border-none p-4 text-xs sm:text-sm font-medium text-on-surface outline-none resize-none placeholder:text-on-surface-variant/40 min-h-[160px] sm:min-h-[220px]"
              />
              
              <div className="p-3 border-t border-surface-container/50 bg-surface-bright/50 rounded-b-2xl flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={isRecording ? stopVoice : startVoice} 
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all border ${isRecording ? "bg-error/10 border-error/30 text-error" : "glass border-surface-container text-on-surface hover:bg-surface-container"}`}
                >
                  <span className={`material-symbols-outlined text-base ${isRecording ? 'animate-pulse' : ''}`}>{isRecording ? "stop_circle" : "mic"}</span>
                  {isRecording ? "Stop Listening" : "Live Voice Answer"}
                </button>
                <button 
                  onClick={submitAnswer} 
                  disabled={!answer.trim() || loading} 
                  className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${(!answer.trim() || loading) ? "bg-surface-container text-on-surface-variant cursor-not-allowed" : "bg-indigo-brand text-white hover:bg-indigo-brand-dark shadow-xs"}`}
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-base">autorenew</span> Evaluating...</>
                  ) : (
                    <>Submit Answer <span className="material-symbols-outlined text-base">send</span></>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl border border-surface-container shadow-sm p-4 sm:p-6 space-y-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-between items-start pb-3 border-b border-surface-container/50">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-gold text-2xl">psychology</span>
                    AI Evaluation
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">Instant feedback on your response.</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl sm:text-4xl font-black ${feedback.score >= 80 ? "text-success" : feedback.score >= 60 ? "text-warning" : "text-error"}`}>
                    {feedback.score}%
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${feedback.score >= 80 ? "text-success" : feedback.score >= 60 ? "text-warning" : "text-error"}`}>
                    {feedback.rating}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-success/5 rounded-xl p-3 border border-success/20">
                  <div className="text-xs font-black text-success mb-1.5 uppercase tracking-wider flex items-center gap-1"><span>✅</span> What you did well</div>
                  <ul className="space-y-1 text-xs text-success/90 font-medium">
                    {(feedback.strengths||[]).map((s:string,i:number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div className="bg-warning/5 rounded-xl p-3 border border-warning/20">
                  <div className="text-xs font-black text-warning mb-1.5 uppercase tracking-wider flex items-center gap-1"><span>📈</span> What to improve</div>
                  <ul className="space-y-1 text-xs text-warning/90 font-medium">
                    {(feedback.improvements||[]).map((s:string,i:number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              </div>
              
              {feedback.ideal_answer && (
                <div className="bg-indigo-brand/5 rounded-xl p-3 border border-indigo-brand/20">
                  <div className="text-xs font-black text-indigo-brand mb-1 uppercase tracking-wider flex items-center gap-1"><span>💡</span> Ideal Answer Example</div>
                  <div className="text-xs text-indigo-brand/90 font-medium leading-relaxed">{feedback.ideal_answer}</div>
                </div>
              )}
              
              <button 
                onClick={nextQuestion} 
                disabled={loading} 
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${loading ? "bg-surface-container text-on-surface-variant cursor-not-allowed" : "bg-indigo-brand text-white hover:bg-indigo-brand-dark shadow-xs"}`}
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin text-base">autorenew</span> Preparing next question...</>
                ) : qIndex + 1 >= questionCount ? (
                  <>Finish Interview &amp; See Results <span className="material-symbols-outlined text-base">flag</span></>
                ) : (
                  <>Next Question ({qIndex+2}/{questionCount}) <span className="material-symbols-outlined text-base">arrow_forward</span></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
