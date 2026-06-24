import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Hammer, 
  MapPin, 
  ShieldCheck, 
  Smartphone, 
  Users, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full border border-slate-100 p-1 bg-white shadow-sm overflow-hidden h-10 w-10">
                <img src="/Lovi-app/icon.svg" alt="Lovi Icon" className="h-7 w-7" />
              </div>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:inline-block">
              WORKS
            </span>
            <span className="ml-2 px-2 py-0.5 bg-sky-100 text-sky-600 text-[10px] font-bold rounded uppercase tracking-wider">Internal Beta</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-sky-500 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-sky-500 transition-colors">Features</a>
          </div>

          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 bg-sky-50 text-sky-600 text-xs font-bold rounded-full uppercase tracking-widest border border-sky-100 inline-block mb-6">
              The Future of Local Labor
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-slate-900">
              Organizing the <br />
              <span className="text-sky-500 italic">Unorganized</span> Market.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
              Lovi Works bridges the gap between skilled professionals and residential micro-jobs, 
              creating a verified, tech-enabled network for the smart home era.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-2xl shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                Join the Network <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Stat Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {[
              { label: 'Technicians', value: '1,200+', icon: Hammer },
              { label: 'Jobs Completed', value: '5,000+', icon: CheckCircle2 },
              { label: 'Active Regions', value: '15+', icon: MapPin },
              { label: 'Smart Installs', value: '800+', icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm">
                <stat.icon className="w-6 h-6 text-sky-500 mb-3 mx-auto" />
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">How Lovi Works</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              We've simplified the entire process from job posting to professional completion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Post a Job',
                desc: 'List your task category, budget, and urgency with photos in seconds.',
                icon: Smartphone,
                color: 'bg-indigo-50 text-indigo-500'
              },
              {
                title: 'Expert Bidding',
                desc: 'Vetted local professionals offer competitive quotes for your specific task.',
                icon: Zap,
                color: 'bg-sky-50 text-sky-500'
              },
              {
                title: 'Get it Done',
                desc: 'Enjoy secure, tech-enabled completion with a digital paper trail.',
                icon: ShieldCheck,
                color: 'bg-emerald-50 text-emerald-500'
              }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-300", step.color)}>
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Pillars */}
      <section id="features" className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Product Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Public Feed', desc: 'Real-time job postings with geolocation tracking.', icon: Smartphone },
                { title: 'Worker Dashboard', desc: 'Digital business cards for reputation building.', icon: Users },
                { title: 'Verification Moat', desc: 'Rigorous vetting of skill and certification.', icon: ShieldCheck },
                { title: 'Feedback Loop', desc: 'Identifies elite talent for Lovi Preferred status.', icon: TrendingUp },
              ].map((pillar, i) => (
                <div key={i} className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] hover:bg-white/10 transition-colors">
                  <pillar.icon className="w-8 h-8 text-sky-400 mb-6" />
                  <h3 className="text-xl font-black mb-3">{pillar.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lovi Integration */}
          <div className="bg-sky-500 rounded-[48px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            
            <div className="lg:flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <Cpu className="w-8 h-8 text-white" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Hardware Integration</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Built for the Lovi <br />Smart Ecosystem.
              </h3>
              <p className="text-sky-50 text-lg mb-8 font-medium">
                Our platform ensures every home has access to vetted technicians capable of 
                installing privacy-first Lovi smart hardware seamlessly.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                   <Lock className="w-5 h-5" />
                   <span className="font-bold text-sm">Privacy First</span>
                </div>
                <div className="flex items-center gap-2">
                   <Zap className="w-5 h-5" />
                   <span className="font-bold text-sm">No Rewiring</span>
                </div>
                <div className="flex items-center gap-2">
                   <Smartphone className="w-5 h-5" />
                   <span className="font-bold text-sm">Local Processing</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 flex justify-center">
              <a 
                href="https://www.lovi.life" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="w-48 h-48 bg-white rounded-[40px] flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                   <img src="/Lovi-app/icon.svg" alt="Lovi Brand" className="w-24 h-24" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Visit Lovi.life
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full border border-slate-100 p-1 bg-white shadow-sm overflow-hidden h-10 w-10">
                <img src="/Lovi-app/icon.svg" alt="Lovi Icon" className="h-7 w-7" />
              </div>
              <div className="h-4 w-px bg-slate-200 mx-1"></div>
              <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">WORKS</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-sky-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Contact</a>
            </div>
            <button 
              onClick={onGetStarted}
              className="px-8 py-3 bg-sky-500 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20"
            >
              Get Started Now
            </button>
          </div>
          <div className="text-center text-slate-400 text-xs font-medium">
            © 2024 Lovi Works. All rights reserved. Part of the Lovi Smart Home Ecosystem.
          </div>
        </div>
      </footer>
    </div>
  );
};
