import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
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
  Lock,
  Star,
  Mail,
  ChevronRight,
  BarChart3,
  Activity,
  Network,
  Award,
  Quote,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';
import { HeroVisual } from './HeroVisual';

interface LandingPageProps {
  onGetStarted: () => void;
}

const CountUp = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.max(1, Math.floor(end / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / 60);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const SectionHeading = ({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    {label && (
      <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-500/20 mb-6">
        {label}
      </span>
    )}
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white">
      {title}
    </h2>
    {subtitle && (
      <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium">
        {subtitle}
      </p>
    )}
  </motion.div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ['rgba(5, 8, 22, 0)', 'rgba(5, 8, 22, 0.85)']);

  return (
    <div className="min-h-screen bg-navy-950 font-sans overflow-x-hidden text-white">
      {/* ====== NAVBAR ====== */}
      <motion.nav
        style={{ background: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 h-20 flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full border border-white/10 p-1 bg-white/5 shadow-sm overflow-hidden h-10 w-10">
              <img src="/Lovi-app/icon.svg" alt="Lovi Icon" className="h-7 w-7" />
            </div>
            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>
            <span className="text-xl font-black tracking-tighter text-white hidden sm:inline-block">
              LOVI WORKS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/40">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a>
          </div>

          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-500/20"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen lg:h-[90vh] pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-[100px] -z-10"
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-500/20 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                The Future of Local Labor
              </motion.span>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-white">
                Organizing the <br />
                <span className="text-blue-400 italic">Unorganized</span> Market.
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-white/50 mb-10 leading-relaxed">
                Lovi Works bridges the gap between skilled professionals and residential micro-jobs,
                creating a verified, tech-enabled network for the smart home era.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-10 py-5 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Join the Network <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Right - Interactive Visual */}
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ====== TRUSTED BY ====== */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/10 mb-10"
          >
            Trusted by Industry Leaders
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-wrap justify-center items-center gap-12 md:gap-16"
          >
            {['TechVista', 'HomeAI', 'SmartNest', 'BuildPro', 'EcoDomus', 'NextGen'].map((name) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-white/10 hover:text-white/30 transition-colors text-lg font-bold tracking-tight cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== ANIMATED STATS ====== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { label: 'Technicians', value: 1200, suffix: '+', icon: Hammer },
              { label: 'Jobs Completed', value: 5000, suffix: '+', icon: CheckCircle2 },
              { label: 'Active Regions', value: 15, suffix: '+', icon: MapPin },
              { label: 'Smart Installs', value: 800, suffix: '+', icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-blue-500/20 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-white/30 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== HOW IT WORKS (Glassmorphism Features) ====== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="How it Works"
            title="How Lovi Works"
            subtitle="We've simplified the entire process from job posting to professional completion."
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Post a Job',
                desc: 'List your task category, budget, and urgency with photos in seconds.',
                icon: Smartphone,
              },
              {
                title: 'Expert Bidding',
                desc: 'Vetted local professionals offer competitive quotes for your specific task.',
                icon: Zap,
              },
              {
                title: 'Get it Done',
                desc: 'Enjoy secure, tech-enabled completion with a digital paper trail.',
                icon: ShieldCheck,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{step.title}</h3>
                <p className="text-white/40 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WHY BUSINESSES CHOOSE LOVI ====== */}
      <section id="why-lovi" className="py-24 px-4 sm:px-6 lg:px-8 bg-navy-900/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Why Lovi"
            title="Why Businesses Choose Lovi"
            subtitle="Thousands of professionals and homeowners trust Lovi Works for their smart home needs."
          />

          <div className="space-y-20">
            {[
              {
                icon: Users,
                title: 'Verified Professional Network',
                stat: '98% match accuracy',
                desc: 'Every professional on Lovi Works undergoes rigorous background verification and skill assessment. We maintain a 98% job-to-professional match rate through intelligent algorithms that learn from every completed project.',
                align: 'left',
              },
              {
                icon: Cpu,
                title: 'Seamless Smart Ecosystem',
                stat: '500+ devices supported',
                desc: 'Our platform integrates with over 500 smart home devices across major brands. From thermostats to security cameras, find experts who know your specific setup and can handle any installation or repair.',
                align: 'right',
              },
              {
                icon: ShieldCheck,
                title: 'Enterprise-Grade Security',
                stat: 'AES-256 encrypted',
                desc: 'Every transaction, message, and data point is protected with bank-level encryption. Your home and personal information stay private and secure, giving you peace of mind with every booking.',
                align: 'left',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: item.align === 'left' ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className={cn(
                  'grid md:grid-cols-2 gap-8 md:gap-16 items-center',
                  item.align === 'right' && 'md:direction-rtl'
                )}
              >
                <div className={cn(item.align === 'right' && 'md:order-last')}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 mb-4">
                    {item.stat}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 text-white">{item.title}</h3>
                  <p className="text-blue-100/50 text-lg leading-relaxed">{item.desc}</p>
                </div>
                <div className={cn('hidden md:flex items-center justify-center', item.align === 'right' && 'md:order-first')}>
                  <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-blue-500/10 to-navy-800/50 rounded-3xl border border-white/10 flex items-center justify-center p-8">
                    <item.icon className="w-32 h-32 text-blue-400/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRODUCT PILLARS ====== */}
      <section id="features" className="py-24 bg-navy-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <SectionHeading
            title="Product Pillars"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: 'Public Feed', desc: 'Real-time job postings with geolocation tracking.', icon: Smartphone },
              { title: 'Worker Dashboard', desc: 'Digital business cards for reputation building.', icon: Users },
              { title: 'Verification Moat', desc: 'Rigorous vetting of skill and certification.', icon: ShieldCheck },
              { title: 'Feedback Loop', desc: 'Identifies elite talent for Lovi Preferred status.', icon: TrendingUp },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-blue-500/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <pillar.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-black mb-3 text-white">{pillar.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed font-medium">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== LOVI SMART ECOSYSTEM ====== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 rounded-[48px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
              className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
              className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"
            />

            <div className="lg:flex-1 text-center lg:text-left relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center lg:justify-start gap-4 mb-6"
              >
                <Cpu className="w-8 h-8 text-white" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Hardware Integration</span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-black mb-6 leading-tight text-white"
              >
                Built for the Lovi <br />Smart Ecosystem.
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-blue-50 text-lg mb-8 font-medium"
              >
                Our platform ensures every home has access to vetted technicians capable of
                installing privacy-first Lovi smart hardware seamlessly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6"
              >
                {[
                  { icon: Lock, text: 'Privacy First' },
                  { icon: Zap, text: 'No Rewiring' },
                  { icon: Smartphone, text: 'Local Processing' },
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm"
                  >
                    <feat.icon className="w-5 h-5 text-white" />
                    <span className="font-bold text-sm text-white">{feat.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:w-1/3 flex justify-center relative z-10"
            >
              <a
                href="https://www.lovi.life"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-48 h-48 bg-white rounded-[40px] flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500 overflow-hidden"
                >
                  <img src="/Lovi-app/icon.svg" alt="Lovi Brand" className="w-24 h-24" />
                </motion.div>
                <div className="absolute -bottom-4 -right-4 bg-navy-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Visit Lovi.life
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-navy-900/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Testimonials"
            title="Trusted by Professionals and Homeowners"
            subtitle="Hear from the people who use Lovi Works every day."
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: 'Lovi Works connected me with a certified smart home technician within hours. The entire experience was seamless from posting to completion.',
                name: 'Sarah Chen',
                title: 'Homeowner',
              },
              {
                quote: 'Managing 12 properties has never been easier. Lovi\'s verification system means I never worry about who I\'m letting into my buildings.',
                name: 'Marcus Johnson',
                title: 'Property Manager',
              },
              {
                quote: 'As a professional, Lovi Works transformed my business. The dashboard helps me manage bids, build reputation, and grow my client base.',
                name: 'Priya Patel',
                title: 'Tech Installer',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-blue-400/30 mb-4" />
                <p className="text-white/40 font-medium leading-relaxed mb-6">{item.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-black text-white">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-xs font-medium text-white/30">{item.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-navy-900" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px]"
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white">
              Ready to Transform Your <br />Smart Home Experience?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of verified professionals and homeowners already using Lovi Works to connect, collaborate, and complete projects.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-6">
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all font-medium backdrop-blur-sm"
                />
              </div>
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-white text-navy-900 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                Get Early Access <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-blue-200/60 text-sm font-medium">
              Join <span className="text-white font-bold">1,200+</span> verified technicians across{' '}
              <span className="text-white font-bold">15+</span> regions
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-navy-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-full border border-white/10 p-1 bg-white/5 shadow-sm overflow-hidden h-10 w-10">
                  <img src="/Lovi-app/icon.svg" alt="Lovi Icon" className="h-7 w-7" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white uppercase">WORKS</span>
              </div>
              <p className="text-white/30 text-sm font-medium">
                Part of the Lovi Smart Home Ecosystem.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20 mb-4">Product</h4>
              <ul className="space-y-3">
                {['How it Works', 'Features', 'Testimonials', 'Pricing'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-white/30 hover:text-blue-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20 mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-medium text-white/30 hover:text-blue-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20 mb-4">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-medium text-white/30 hover:text-blue-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
            <div className="text-white/20 text-xs font-medium">
              &copy; 2024 Lovi Works. All rights reserved. Part of the Lovi Smart Home Ecosystem.
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
