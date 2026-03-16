import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  Sparkles, ArrowRight, Loader2, 
  TrendingUp, Activity, BarChart3, 
  BrainCircuit, Github, AlertTriangle, X, LineChart, Lightbulb, Target,
  Linkedin, LogOut, LayoutList, TextSelection
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface RevenueProjection {
  year: string;
  revenue: number;
}

interface MarketShare {
  name: string;
  share: number;
}

interface CompetitorComparison {
  feature: string;
  competitor_a: string;
  competitor_b: string;
  dayzero_ai: string;
}

interface ChartData {
  revenue_projection: RevenueProjection[];
  market_share_pie: MarketShare[];
  competitor_comparison_table: CompetitorComparison[];
  viability_score: number;
}

interface GTMAnalysis {
  markdown_text: string;
  chart_data: ChartData;
}



const loadingTexts = [
  'Analyzing Market Trends...',
  'Sizing Addressable Market...',
  'Evaluating GTM Strategy...',
  'Calculating Viability Score...',
  'Assessing Key Risks...'
];

const EXAMPLES = [
  {
    title: 'AI-Powered ATS for Tech Companies',
    idea: 'An AI-powered Applicant Tracking System specifically for high-growth tech startups. It uses LLMs to score technical assessments automatically, conduct pre-screening voice interviews, and match candidate GitHub repos against the company\'s tech stack. Focus is on reducing time-to-hire by 50%.'
  },
  {
    title: 'B2B Smart Contract Coffee Sourcing',
    idea: 'A SaaS platform for independent coffee shops to source beans directly from farmers using smart contracts. Eliminates middlemen, ensures fair trade verification on the blockchain, and provides real-time supply chain tracking from farm to cup.'
  },
  {
    title: 'WasteVision Real-Time Sorting API',
    idea: 'A computer vision API for recycling facilities that identifies and sorts complex waste materials in real-time. Can be integrated into existing conveyor belt systems. Primarily targeting municipal waste management contracts to improve recycling purity rates.'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function ErrorToast({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose, message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md border border-red-500/30 shadow-[0_8px_30px_rgba(239,68,68,0.2)] text-slate-200 px-4 py-3 rounded-xl max-w-md w-full"
    >
      <div className="bg-red-500/20 p-2 rounded-full shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
      <button onClick={onClose} className="p-1 shrink-0 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 mt-16 bg-slate-900/30 rounded-3xl backdrop-blur-sm border border-cyan-500/20 max-w-2xl mx-auto w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
      </div>
      <div className="h-8 relative w-full overflow-hidden flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-medium text-cyan-300 absolute text-center"
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4']; // Purple, Indigo, Cyan

function MarketChart({ data }: { data: MarketShare[] }) {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={6}
            dataKey="share"
            stroke="none"
            animationDuration={1500}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                style={{ filter: `drop-shadow(0px 0px 6px ${COLORS[index % COLORS.length]}90)` }} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value: any) => [`${value}%`, 'Market Share']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-slate-300 text-sm font-medium ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Dashboard({ analysis }: { analysis: GTMAnalysis }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-7xl mt-16 z-10 space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-300 mb-4">
          Investment Thesis
        </h2>
        <p className="text-slate-400 text-lg">Your VC-grade opportunity breakdown is ready.</p>
      </motion.div>

      {/* Top Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Viability Score Card */}
        <div className="glass-card p-8 rounded-3xl border-t-cyan-500/50 flex flex-col sm:flex-row items-center justify-between gap-8 bg-gradient-to-br from-slate-900/80 to-slate-950/80 shadow-[0_8px_32px_rgba(6,182,212,0.1)]">
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 text-cyan-400 mb-2">
              <Activity className="w-7 h-7" />
              <h3 className="text-2xl font-bold text-white tracking-wide">Viability Score</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              A composite metric based on market size, competition, and go-to-market feasibility. Scores above 70 indicate strong startup potential.
            </p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center">
              <svg className="absolute inset-0 transform -rotate-90 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="url(#score-gradient)" strokeWidth="8" 
                  strokeDasharray="283" strokeDashoffset={283 - (283 * analysis.chart_data.viability_score) / 100}
                  className="transition-all duration-1500 ease-out" strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-md">
                  {analysis.chart_data.viability_score}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Share Opportunity Card */}
        <div className="glass-card p-8 rounded-3xl border-t-indigo-500/50 bg-gradient-to-bl from-slate-900/80 to-slate-950/80 flex flex-col shadow-[0_8px_32px_rgba(99,102,241,0.1)] overflow-hidden">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <BarChart3 className="w-7 h-7" />
            <h3 className="text-2xl font-bold text-white tracking-wide">Market Share Split</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">Estimated competitor dominance vs. your wedge</p>
          <div className="flex-grow flex items-center justify-center -mb-2">
             <MarketChart data={analysis.chart_data.market_share_pie} />
          </div>
        </div>
      </motion.div>

      {/* Markdown Text Analysis */}
      <motion.div variants={itemVariants} className="glass-card p-8 md:p-10 rounded-3xl border-t-purple-500/50 shadow-xl prose prose-invert prose-cyan max-w-none">
        <div className="flex items-center gap-3 text-purple-400 mb-6 pb-6 border-b border-white/10">
          <TextSelection className="w-7 h-7" />
          <h3 className="text-2xl font-bold text-white tracking-wide m-0">Go-To-Market Thesis</h3>
        </div>
        <ReactMarkdown
          components={{
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-cyan-300 mt-10 mb-4" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold text-indigo-300 mt-8 mb-3" {...props} />,
            p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4 text-base" {...props} />,
            li: ({node, ...props}) => <li className="text-slate-300 mb-2" {...props} />,
            strong: ({node, ...props}) => <strong className="text-emerald-400 font-semibold" {...props} />,
          }}
        >
          {analysis.markdown_text}
        </ReactMarkdown>
      </motion.div>

      {/* Visual Data Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        
        {/* Revenue Projection Line Chart */}
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 flex flex-col shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 text-emerald-400 mb-6">
            <TrendingUp className="w-7 h-7" />
            <h3 className="text-xl font-bold text-white">5-Year Revenue Projection</h3>
          </div>
          <div className="flex-grow w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={analysis.chart_data.revenue_projection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8'}} 
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} dot={{ fill: '#34d399', r: 4 }} activeDot={{ r: 6 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor Comparison Table */}
        <div className="glass-card p-8 rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/30 to-slate-900/60 shadow-lg overflow-x-auto">
          <div className="flex items-center gap-3 text-rose-400 mb-6">
            <LayoutList className="w-7 h-7" />
            <h3 className="text-xl font-bold text-white">Competitor Features Setup</h3>
          </div>
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-sm font-semibold text-slate-400">Feature</th>
                <th className="py-4 px-4 text-sm font-semibold text-slate-400">Competitor A</th>
                <th className="py-4 px-4 text-sm font-semibold text-slate-400">Competitor B</th>
                <th className="py-4 px-4 text-sm font-bold text-rose-400">DayZero AI Idea</th>
              </tr>
            </thead>
            <tbody>
              {analysis.chart_data.competitor_comparison_table.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm text-slate-200">{row.feature}</td>
                  <td className="py-4 px-4 text-sm text-slate-400">{row.competitor_a}</td>
                  <td className="py-4 px-4 text-sm text-slate-400">{row.competitor_b}</td>
                  <td className="py-4 px-4 text-sm text-rose-300 font-medium">{row.dayzero_ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </motion.div>
    </motion.div>
  );
}

function App() {
  const BACKEND_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
    ? 'http://localhost:8000'
    : 'https://founderiq-backend.onrender.com';

  const [originalIdea, setOriginalIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const navigate = useNavigate();


  const [analysis, setAnalysis] = useState<GTMAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('--- Auth: getSession result ---', session ? `User: ${session.user?.id}` : 'No session');
      setSession(session);
      setAuthLoading(false);
      if (!session) {
        navigate('/login');
      }
    });
    // Listen for auth changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('--- Auth: onAuthStateChange ---', _event, session ? `User: ${session.user?.id}` : 'No session');
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAnalysis(null);
    setOriginalIdea('');
  };

  // Auto-scroll to top when 'Get Started' or logo is clicked
  const scrollToTop = (e?: React.MouseEvent) => {
    e?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHero = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById('hero-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDeepDive = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!originalIdea.trim()) return;

    console.log('--- Step 1: Deep Dive Triggered ---');
    console.log('Sending originalIdea to /generate-questions:', { startup_idea: originalIdea });

    setIsGeneratingQuestions(true);
    setError(null);

    const el = document.getElementById('hero-section');
    if (el && !analysis) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${BACKEND_URL}/generate-questions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          startup_idea: originalIdea,
          user_id: session?.user?.id ?? null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate clarifying questions.');
      }

      const data = await response.json();
      console.log('--- Step 2: Questions Received ---', data.questions);
      setGeneratedQuestions(data.questions);
      setUserAnswers(new Array(data.questions.length).fill(''));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalIdea.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    // Smooth scroll to the form when starting analysis
    const el = document.getElementById('hero-section');
    if (el && !analysis) { // Only scroll if we aren't already viewing an analysis
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      console.log('--- Step 3 & 4: Submitting Analysis ---');
      const payload = {
        startup_idea: originalIdea,
        user_id: session?.user?.id ?? null,
        questions: generatedQuestions ?? undefined,
        answers: generatedQuestions ? userAnswers : undefined,
      };
      console.log('Payload being sent to /validate-idea:', payload);

      const response = await fetch(`${BACKEND_URL}/validate-idea`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the idea. Ensure backend is running and API key is set.');
      }

      const data = await response.json();
      console.log('--- Response Received ---', data);
      setAnalysis(data);
      setGeneratedQuestions(null);
      setUserAnswers([]);
      
      // Save directly from frontend disabled 
      // Refresh history after successful analysis disabled
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show a loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  // If not authenticated, we navigated away
  if (!session) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col font-sans">
      
      {/* Abstract Glowing Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 text-white group outline-none">
            <LineChart className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="font-bold text-xl tracking-wide group-hover:text-slate-200 transition-colors">
              DayZero <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">AI</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</a>
            <a href="#examples" className="hover:text-cyan-400 transition-colors">Examples</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500 truncate max-w-[160px]">{session?.user?.email}</span>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-sm font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>



      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center pt-28 pb-32 px-4 sm:px-6 lg:px-8 z-10 w-full">
        
        {/* --- HERO SECTION --- */}
        <section id="hero-section" className="w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered VC Validation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-200 drop-shadow-sm">
              Validate Your Startup Idea
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium">
              Pitch your idea to our AI Venture Capitalist. Receive an instant, comprehensive Go-To-Market analysis to shape your strategy.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="glass-card rounded-2xl p-1 md:p-2 relative group transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]">
              {/* Subtle gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              
              <form onSubmit={handleAnalyze} className="relative bg-slate-900/50 rounded-xl p-6 sm:p-8 backdrop-blur-2xl">
                {!generatedQuestions && (
                  <>
                    <label htmlFor="originalIdea" className="block text-sm font-medium text-slate-300 mb-3 ml-1">
                      Describe your idea, target audience, and unique value proposition...
                    </label>
                    <textarea
                      id="originalIdea"
                      rows={5}
                      value={originalIdea}
                      onChange={(e) => setOriginalIdea(e.target.value)}
                      className="glass-input block w-full rounded-xl sm:text-lg p-5 resize-none leading-relaxed"
                      placeholder="e.g. A SaaS platform for independent coffee shops to source beans directly from farmers using smart contracts..."
                      required
                    />
                  </>
                )}

                <AnimatePresence>
                  {generatedQuestions && generatedQuestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-5 overflow-hidden"
                    >
                      <h3 className="text-lg font-bold text-cyan-400 border-b border-cyan-500/20 pb-2 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5" /> Deep Dive Questions
                      </h3>
                      {generatedQuestions.map((q, i) => (
                        <div key={i}>
                          <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                            {q}
                          </label>
                          <textarea
                            rows={2}
                            value={userAnswers[i] || ''}
                            onChange={(e) => {
                              const newAns = [...userAnswers];
                              newAns[i] = e.target.value;
                              setUserAnswers(newAns);
                            }}
                            className="glass-input block w-full rounded-xl p-4 resize-none text-sm text-slate-200 focus:border-cyan-500/50"
                            placeholder="Your answer..."
                            required
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                  {!generatedQuestions ? (
                    <>
                      <motion.button
                        type="button"
                        onClick={handleDeepDive}
                        disabled={isGeneratingQuestions || isLoading || !originalIdea.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 font-bold text-white transition-all duration-200 ease-in-out rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                      >
                        {isGeneratingQuestions ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="w-5 h-5 text-purple-400" />
                            <span>Deep Dive</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isGeneratingQuestions || isLoading || !originalIdea.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                      >
                        <>
                          <span>Quick Analyze</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                    >
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Submit Deep Dive Analysis</span>
                      </>
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </section>

        {/* Dashboard / Loading Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center mt-8"
            >
              <LoadingState />
            </motion.div>
          )}
          
          {analysis && !isLoading && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex justify-center mt-8" // Added margin-top to separate from form
            >
              <Dashboard analysis={analysis} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hide Information Sections if Analysis is populated or loading to keep user focused */}
        <AnimatePresence>
          {!analysis && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full flex flex-col items-center mt-24 space-y-32 max-w-6xl"
            >
              
              {/* --- HOW IT WORKS SECTION --- */}
              <section id="how-it-works" className="w-full flex flex-col items-center">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white tracking-wide mb-4">How It Works</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">Skip the months of research. Go from raw idea to fully validated business strategy in under a minute.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Step 1: Pitch Your Vision</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Enter your startup idea, target audience, and unique value proposition into the prompt box above.</p>
                  </div>
                  
                  <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 relative">
                    <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-[2px] bg-gradient-to-r from-transparent to-cyan-500/50" />
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                      <BrainCircuit className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Step 2: AI Market Analysis</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Our finely-tuned GenAI model runs an analysis through the lens of a ruthless, data-driven VC investor.</p>
                  </div>

                  <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 relative">
                    <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-[2px] bg-gradient-to-r from-transparent to-indigo-500/50" />
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Step 3: Get GTM Strategy</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Receive a complete breakdown including TAM size, pricing models, target personas, and Go-to-Market strategies.</p>
                  </div>
                </div>
              </section>

              {/* --- EXAMPLES SECTION --- */}
              <section id="examples" className="w-full flex flex-col items-center">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white tracking-wide mb-4">Try a Sample</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">Not sure what to type? Click a card below to populate the form and test the AI instantly.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {EXAMPLES.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        setOriginalIdea(example.idea);
                        scrollToHero();
                      }}
                      className="text-left glass-card p-6 rounded-2xl flex flex-col h-full hover:bg-slate-800/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <h3 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-cyan-300 transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 group-hover:text-slate-300 transition-colors">
                        "{example.idea}"
                      </p>
                      <div className="mt-auto pt-4 flex items-center text-cyan-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Use this idea</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/10 bg-slate-950 px-4 py-8 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <LineChart className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-lg text-slate-300">DayZero <span className="text-slate-400">AI</span></span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            Vibe coded by <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent font-bold">GANDIKOTA SAIKOWSHIK</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com/GSaikowshik/FounderIQ" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" aria-label="GitHub"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-cyan-400 transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      </AnimatePresence>

    </div>
  );
}

export default App;
