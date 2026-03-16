
import { motion } from 'framer-motion';
import { ArrowRight, LineChart, Sparkles, Target, Zap, ShieldCheck, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col font-sans overflow-hidden">
      {/* Abstract Glowing Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white group outline-none">
            <LineChart className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="font-bold text-xl tracking-wide group-hover:text-slate-200 transition-colors">
              DayZero <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-lg hover:from-cyan-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 z-10 w-full relative">
        <section className="w-full flex flex-col items-center max-w-4xl mx-auto text-center mt-12 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>The Next Generation of Idea Validation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-200 drop-shadow-sm leading-tight">
              Don't Build in the Dark.<br />Validate with AI.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
              DayZero AI is an AI-powered Venture Capitalist in your pocket. Get instant Go-To-Market analysis,
              market sizing, and viability scores before writing a single line of code.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/login"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 ease-in-out rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                Start Validating Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Highlights */}
        <section className="mt-32 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Market Sizing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identify your TAM, SAM, and SOM instantly. Get clear metrics on the revenue opportunity for your exact niche.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">GTM Strategy</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate aggressive, tested go-to-market strategies tailored to your Ideal Customer Profile and Persona.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Risk Assessment</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Know the blindspots before you launch. AI uncovers potential pitfalls and assigns a composite Viability Score.
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="w-full border-t border-white/10 bg-slate-950/80 px-4 py-8 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <LineChart className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-lg text-slate-300">DayZero <span className="text-slate-400">AI</span></span>
          </div>
          <div className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
            <span>Vibe coded by</span>
            <a 
              href="https://www.linkedin.com/in/gandikotasaikowshik/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-1 text-white hover:text-blue-400 font-bold transition-all"
            >
              <span>GANDIKOTA SAIKOWSHIK</span>
              <Linkedin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
