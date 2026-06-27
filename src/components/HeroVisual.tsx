import { motion } from 'motion/react';
import {
  CheckCircle2, Clock, Users, Star
} from 'lucide-react';

function HouseSvg() {
  return (
    <svg viewBox="0 0 140 120" className="w-24 h-24">
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <filter id="windowGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="70" cy="116" rx="60" ry="6" fill="rgba(59,130,246,0.08)" />

      {/* Walls */}
      <rect x="20" y="45" width="100" height="65" rx="3" fill="url(#wallGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Roof */}
      <polygon points="70,12 10,50 130,50" fill="url(#roofGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Roof highlight */}
      <polygon points="70,12 10,50 70,50" fill="rgba(59,130,246,0.06)" />

      {/* Left window */}
      <rect x="35" y="58" width="20" height="24" rx="3" fill="#0F172A" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <rect x="36" y="59" width="18" height="22" rx="2" fill="#3B82F6" opacity="0.6" filter="url(#windowGlow)">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Window cross */}
      <line x1="45" y1="59" x2="45" y2="81" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <line x1="36" y1="70" x2="54" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

      {/* Right window */}
      <rect x="85" y="58" width="20" height="24" rx="3" fill="#0F172A" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <rect x="86" y="59" width="18" height="22" rx="2" fill="#3B82F6" opacity="0.4" filter="url(#windowGlow)">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite" />
      </rect>
      <line x1="95" y1="59" x2="95" y2="81" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <line x1="86" y1="70" x2="104" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

      {/* Door */}
      <rect x="60" y="80" width="20" height="30" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
      <rect x="62" y="82" width="16" height="26" rx="1" fill="#1E293B" />
      {/* Door knob */}
      <circle cx="74" cy="96" r="1.5" fill="rgba(59,130,246,0.5)" />
      {/* Door step */}
      <rect x="55" y="108" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.05)" />

      {/* Roof chimney */}
      <rect x="95" y="18" width="10" height="20" rx="1" fill="#1E293B" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    </svg>
  );
}

function WorkerAvatar({ color, tool }: { color: string; tool: 'zap' | 'droplets' | 'hammer' | 'sparkles' | 'wind' }) {
  const iconColors: Record<string, string> = {
    zap: '#EAB308',
    droplets: '#06B6D4',
    hammer: '#D97706',
    sparkles: '#10B981',
    wind: '#0EA5E9',
  };
  const hatColor = iconColors[color];
  const bodyColor = iconColors[color];

  return (
    <svg viewBox="0 0 40 46" className="w-10 h-11">
      {/* Glow behind */}
      <circle cx="20" cy="22" r="18" fill={hatColor} opacity="0.08" />

      {/* Hard hat */}
      <ellipse cx="20" cy="10" rx="12" ry="5" fill={hatColor} />
      <rect x="12" y="10" width="16" height="3" rx="1.5" fill={hatColor} opacity="0.8" />
      {/* Hat highlight */}
      <ellipse cx="20" cy="8.5" rx="6" ry="2" fill="white" opacity="0.15" />

      {/* Face */}
      <circle cx="20" cy="17" r="5.5" fill="#FED7AA" />
      {/* Eyes */}
      <circle cx="18" cy="16.5" r="0.8" fill="#1E293B" />
      <circle cx="22" cy="16.5" r="0.8" fill="#1E293B" />
      {/* Smile */}
      <path d="M17.5 19.5 Q20 21.5 22.5 19.5" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeLinecap="round" />

      {/* Body / Uniform */}
      <rect x="12" y="23" width="16" height="17" rx="3" fill={bodyColor} opacity="0.9" />
      {/* Collar */}
      <path d="M16 23 L20 26 L24 23" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />

      {/* Tool icon on chest */}
      {tool === 'zap' && (
        <path d="M19 27 L18 30 L21 30 L20 33 L22 29 L19 29 Z" fill="white" opacity="0.9" />
      )}
      {tool === 'droplets' && (
        <path d="M20 28 Q17 32 17 33.5 A3 3 0 0 0 23 33.5 Q23 32 20 28 Z" fill="white" opacity="0.9" />
      )}
      {tool === 'hammer' && (
        <g>
          <rect x="19.5" y="28" width="2" height="7" rx="0.5" fill="white" opacity="0.7" />
          <rect x="17" y="27" width="7" height="2.5" rx="0.5" fill="white" opacity="0.9" />
        </g>
      )}
      {tool === 'sparkles' && (
        <g>
          <path d="M20 28 L20.5 30 L22 30.5 L20.5 31 L20 33 L19.5 31 L18 30.5 L19.5 30 Z" fill="white" opacity="0.9" />
          <circle cx="16.5" cy="29" r="0.5" fill="white" opacity="0.6" />
          <circle cx="23.5" cy="29" r="0.5" fill="white" opacity="0.6" />
          <circle cx="20" cy="35" r="0.5" fill="white" opacity="0.6" />
        </g>
      )}
      {tool === 'wind' && (
        <g>
          <path d="M17 31 Q19 29 21 31 Q23 33 21 34" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
          <path d="M18 29.5 Q20 28 22 29.5" fill="none" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        </g>
      )}

      {/* Arms */}
      <rect x="8" y="25" width="5" height="10" rx="2" fill={bodyColor} opacity="0.7" />
      <rect x="27" y="25" width="5" height="10" rx="2" fill={bodyColor} opacity="0.7" />

      {/* Legs */}
      <rect x="14" y="39" width="5" height="6" rx="1.5" fill="#1E293B" />
      <rect x="21" y="39" width="5" height="6" rx="1.5" fill="#1E293B" />
    </svg>
  );
}

const workers = [
  {
    name: 'Electrician', tool: 'zap' as const,
    lineColor: 'from-yellow-400/60',
    bg: 'bg-yellow-500/10', border: 'border-yellow-500/20',
    color: 'text-yellow-400',
    top: '8%', left: '8%', delay: 0,
  },
  {
    name: 'Plumber', tool: 'droplets' as const,
    lineColor: 'from-cyan-400/60',
    bg: 'bg-cyan-500/10', border: 'border-cyan-500/20',
    color: 'text-cyan-400',
    top: '8%', right: '8%', delay: 0.15,
  },
  {
    name: 'Carpenter', tool: 'hammer' as const,
    lineColor: 'from-amber-400/60',
    bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    color: 'text-amber-400',
    top: '36%', left: '0%', delay: 0.3,
  },
  {
    name: 'Cleaner', tool: 'sparkles' as const,
    lineColor: 'from-emerald-400/60',
    bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    color: 'text-emerald-400',
    top: '36%', right: '0%', delay: 0.45,
  },
  {
    name: 'AC Tech', tool: 'wind' as const,
    lineColor: 'from-sky-400/60',
    bg: 'bg-sky-500/10', border: 'border-sky-500/20',
    color: 'text-sky-400',
    bottom: '8%', left: '46%', delay: 0.6,
  },
];

const flowCards = [
  { text: 'Job Posted', icon: Clock, color: 'text-amber-400', top: '6%', right: '38%', delay: 0.7 },
  { text: 'Worker Assigned', icon: Users, color: 'text-blue-400', bottom: '36%', left: '2%', delay: 0.9 },
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
  if (w.left) base.left = `calc(${w.left} + 110px)`;
  if (w.right) base.right = `calc(${w.right} + 110px)`;
  return base;
});

export function HeroVisual() {
  return (
    <div className="relative w-full h-[520px] hidden lg:block">
      {/* Glow behind house */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px]"
      />

      {/* Connection lines from workers toward center */}
      {workers.map((w, i) => (
        <motion.div
          key={`line-${i}`}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.5, 0], scaleX: [0, 1, 0] }}
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
          animate={{ opacity: 1, scale: 1, y: [-5, 5, -5] }}
          transition={{
            opacity: { delay: 0.3 + w.delay, duration: 0.5 },
            scale: { delay: 0.3 + w.delay, duration: 0.5 },
            y: { repeat: Infinity, duration: 3.5 + i * 0.3, ease: 'easeInOut', delay: w.delay },
          }}
          whileHover={{ scale: 1.08, y: 0 }}
          className={`absolute flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-b from-navy-800/90 to-navy-900/90 backdrop-blur-xl border ${w.border} shadow-lg shadow-blue-500/5 cursor-default group transition-colors z-10`}
          style={{ top: w.top, left: w.left, right: w.right, bottom: w.bottom }}
        >
          <div className={`rounded-lg ${w.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <WorkerAvatar color={w.tool} tool={w.tool} />
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
          <div className="flex items-center justify-center mx-auto mb-3">
            <HouseSvg />
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
          className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-b from-navy-800/80 to-navy-900/80 backdrop-blur-xl border border-white/10 shadow-lg z-10"
          style={{ top: card.top, bottom: card.bottom, right: card.right, left: card.left }}
        >
          <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
          <span className="text-[10px] font-bold text-white/70 whitespace-nowrap">{card.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
