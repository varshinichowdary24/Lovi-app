import { motion } from 'motion/react';
import {
  Home, Zap, Droplets, Hammer, Sparkles, Wind,
  CheckCircle2, Clock, Users, Star
} from 'lucide-react';

const workers = [
  {
    name: 'Electrician', icon: Zap, lineColor: 'from-yellow-400/60',
    color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20',
    top: '12%', left: '8%', delay: 0,
  },
  {
    name: 'Plumber', icon: Droplets, lineColor: 'from-cyan-400/60',
    color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20',
    top: '12%', right: '8%', delay: 0.15,
  },
  {
    name: 'Carpenter', icon: Hammer, lineColor: 'from-amber-400/60',
    color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    top: '38%', left: '2%', delay: 0.3,
  },
  {
    name: 'Cleaner', icon: Sparkles, lineColor: 'from-emerald-400/60',
    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    top: '38%', right: '2%', delay: 0.45,
  },
  {
    name: 'AC Tech', icon: Wind, lineColor: 'from-sky-400/60',
    color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20',
    bottom: '10%', left: '46%', delay: 0.6,
  },
];

const flowCards = [
  { text: 'Job Posted', icon: Clock, color: 'text-amber-400', top: '6%', right: '38%', delay: 0.7 },
  { text: 'Worker Assigned', icon: Users, color: 'text-blue-400', bottom: '38%', left: '2%', delay: 0.9 },
  { text: 'Job Completed', icon: CheckCircle2, color: 'text-emerald-400', bottom: '6%', right: '38%', delay: 1.1 },
];

const lineStyles = workers.map((w) => {
  const base: React.CSSProperties = {
    position: 'absolute',
    height: 1,
    width: 64,
    top: '50%',
    transform: 'translateY(-50%)',
  };
  if (w.left) base.left = `calc(${w.left} + 90px)`;
  if (w.right) base.right = `calc(${w.right} + 90px)`;
  return base;
});

export function HeroVisual() {
  return (
    <div className="relative w-full h-[520px] hidden lg:block">
      {/* Glow behind house */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]"
      />

      {/* Connection lines from workers toward center */}
      {workers.map((w, i) => (
        <motion.div
          key={`line-${i}`}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: w.delay, ease: 'easeInOut' }}
          style={{ ...lineStyles[i], transformOrigin: 'left center' }}
          className={`bg-gradient-to-r ${w.lineColor} to-transparent`}
        />
      ))}

      {/* Worker Cards */}
      {workers.map((w, i) => (
        <motion.div
          key={w.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
          transition={{
            opacity: { delay: 0.3 + w.delay, duration: 0.5 },
            scale: { delay: 0.3 + w.delay, duration: 0.5 },
            y: { repeat: Infinity, duration: 3 + i * 0.3, ease: 'easeInOut', delay: w.delay },
          }}
          whileHover={{ scale: 1.08, y: 0 }}
          className={`absolute flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-b from-navy-800/90 to-navy-900/90 backdrop-blur-xl border ${w.border} shadow-lg shadow-blue-500/5 cursor-default group transition-colors z-10`}
          style={{ top: w.top, left: w.left, right: w.right, bottom: w.bottom }}
        >
          <div className={`w-9 h-9 rounded-lg ${w.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <w.icon className={`w-4 h-4 ${w.color}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white whitespace-nowrap">{w.name}</span>
              <CheckCircle2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-medium text-white/30">Online</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Central Smart Home Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <motion.div
          animate={{ boxShadow: ['0 0 30px rgba(59,130,246,0.1)', '0 0 60px rgba(59,130,246,0.25)', '0 0 30px rgba(59,130,246,0.1)'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative bg-gradient-to-b from-navy-800/90 to-navy-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-blue-500/10"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
            <Home className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-white">Smart Home</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Connected</p>
          </div>
          <div className="flex items-center justify-center gap-1 mt-3">
            <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
            <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
            <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
            <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
            <Star className="w-3 h-3 fill-blue-400/50 text-blue-400/50" />
          </div>
        </motion.div>
      </motion.div>

      {/* Flow Status Cards */}
      {flowCards.map((card, i) => (
        <motion.div
          key={card.text}
          initial={{ opacity: 0, x: i === 0 ? 20 : -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
          transition={{
            opacity: { delay: 0.6 + card.delay, duration: 0.5 },
            x: { delay: 0.6 + card.delay, duration: 0.5 },
            y: { repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: card.delay },
          }}
          className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-b from-navy-800/80 to-navy-900/80 backdrop-blur-xl border border-white/10 shadow-lg z-10`}
          style={{ top: card.top, bottom: card.bottom, right: card.right, left: card.left }}
        >
          <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
          <span className="text-[10px] font-bold text-white/70 whitespace-nowrap">{card.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
