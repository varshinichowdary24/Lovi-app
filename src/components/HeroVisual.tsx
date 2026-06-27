import { motion } from 'motion/react';
import { Lock, Wifi } from 'lucide-react';

function HouseSvg() {
  return (
    <svg viewBox="0 0 160 130" className="w-28 h-28">
      <defs>
        <linearGradient id="wallFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="wallSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="80" cy="126" rx="72" ry="6" fill="rgba(59,130,246,0.08)" />

      {/* Side wall (right face - 3D perspective) */}
      <polygon points="80,30 140,50 140,110 80,90" fill="url(#wallSide)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      {/* Side window */}
      <rect x="90" y="58" width="16" height="20" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" />
      <rect x="91" y="59" width="14" height="18" rx="1.5" fill="#3B82F6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Front wall */}
      <rect x="20" y="40" width="80" height="70" rx="2" fill="url(#wallFront)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* Left window */}
      <rect x="32" y="52" width="18" height="22" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
      <rect x="33" y="53" width="16" height="20" rx="1.5" fill="#3B82F6" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <line x1="41" y1="53" x2="41" y2="73" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
      <line x1="33" y1="63" x2="50" y2="63" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />

      {/* Right front window */}
      <rect x="70" y="52" width="18" height="22" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
      <rect x="71" y="53" width="16" height="20" rx="1.5" fill="#3B82F6" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
      </rect>
      <line x1="79" y1="53" x2="79" y2="73" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
      <line x1="71" y1="63" x2="88" y2="63" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />

      {/* Door */}
      <rect x="47" y="80" width="26" height="30" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" />
      <rect x="49" y="82" width="22" height="26" rx="1.5" fill="#1E293B" />
      <circle cx="67" cy="96" r="1.5" fill="rgba(59,130,246,0.4)" />
      <rect x="42" y="108" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />

      {/* Main roof (front triangle) */}
      <polygon points="60,8 20,45 140,45" fill="url(#roofGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      {/* Roof ridge highlight */}
      <polygon points="60,8 20,45 80,45" fill="rgba(59,130,246,0.04)" />
      {/* Roof edge (side) */}
      <polygon points="80,30 140,50 140,45 80,25" fill="#1E293B" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />

      {/* Chimney */}
      <rect x="105" y="15" width="14" height="24" rx="1.5" fill="#1E293B" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <rect x="103" y="14" width="18" height="3" rx="1" fill="#334155" />
    </svg>
  );
}

function WorkerAvatar({ color, tool }: { color: string; tool: 'zap' | 'droplets' | 'hammer' | 'sparkles' }) {
  const iconColors: Record<string, string> = {
    zap: '#EAB308',
    droplets: '#06B6D4',
    hammer: '#D97706',
    sparkles: '#10B981',
  };
  const c = iconColors[color];

  return (
    <svg viewBox="0 0 38 44" className="w-9 h-10">
      {/* Hard hat */}
      <ellipse cx="19" cy="9" rx="11" ry="4.5" fill={c} />
      <rect x="12" y="9" width="14" height="2.5" rx="1.2" fill={c} opacity="0.8" />
      <ellipse cx="19" cy="7.5" rx="5.5" ry="1.8" fill="white" opacity="0.12" />

      {/* Face */}
      <circle cx="19" cy="16" r="5" fill="#FED7AA" />
      <circle cx="17" cy="15.5" r="0.7" fill="#1E293B" />
      <circle cx="21" cy="15.5" r="0.7" fill="#1E293B" />
      <path d="M17 18 Q19 19.5 21 18" fill="none" stroke="#1E293B" strokeWidth="0.4" strokeLinecap="round" />

      {/* Uniform */}
      <rect x="12" y="22" width="14" height="15" rx="2.5" fill={c} opacity="0.9" />
      <path d="M15.5 22 L19 25 L22.5 22" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />

      {/* Tool chest icon */}
      {tool === 'zap' && (
        <path d="M18 26 L17 29 L20 29 L19 32 L21 28 L18 28 Z" fill="white" opacity="0.85" />
      )}
      {tool === 'droplets' && (
        <path d="M19 26.5 Q16.5 30 16.5 31.3 A2.5 2.5 0 0 0 21.5 31.3 Q21.5 30 19 26.5 Z" fill="white" opacity="0.85" />
      )}
      {tool === 'hammer' && (
        <g>
          <rect x="18.5" y="26.5" width="1.5" height="6" rx="0.4" fill="white" opacity="0.65" />
          <rect x="16.5" y="25.5" width="5.5" height="2" rx="0.4" fill="white" opacity="0.85" />
        </g>
      )}
      {tool === 'sparkles' && (
        <g>
          <path d="M19 26.5 L19.4 28.2 L21 28.6 L19.4 29 L19 30.7 L18.6 29 L17 28.6 L18.6 28.2 Z" fill="white" opacity="0.85" />
          <circle cx="16" cy="27.5" r="0.4" fill="white" opacity="0.5" />
          <circle cx="22" cy="27.5" r="0.4" fill="white" opacity="0.5" />
        </g>
      )}

      {/* Arms */}
      <rect x="8.5" y="23.5" width="4.5" height="8" rx="1.8" fill={c} opacity="0.65" />
      <rect x="25" y="23.5" width="4.5" height="8" rx="1.8" fill={c} opacity="0.65" />

      {/* Legs */}
      <rect x="13.5" y="36" width="4.5" height="6" rx="1.2" fill="#1E293B" />
      <rect x="20" y="36" width="4.5" height="6" rx="1.2" fill="#1E293B" />
    </svg>
  );
}

function ConnectionLine({ start, delay }: { start: { x: number; y: number }; delay: number }) {
  const end = { x: 50, y: 50 };
  const d = `M${start.x},${start.y} Q${(start.x + end.x) / 2},${start.y} ${end.x},${end.y}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <motion.path
        d={d}
        fill="none"
        stroke="rgba(59,130,246,0.25)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0.15, 0.45, 0.15] }}
        transition={{
          pathLength: { duration: 1, delay, ease: 'easeOut' },
          opacity: { repeat: Infinity, duration: 3, delay, ease: 'easeInOut' },
        }}
      />
    </svg>
  );
}

const workers = [
  {
    name: 'Electrician', tool: 'zap' as const,
    lineColor: 'from-yellow-400/60',
    bg: 'bg-yellow-500/10', border: 'border-yellow-500/20',
    color: 'text-yellow-400',
    top: '10%', left: '10%', delay: 0, lineStart: { x: 28, y: 12 },
  },
  {
    name: 'Plumber', tool: 'droplets' as const,
    lineColor: 'from-cyan-400/60',
    bg: 'bg-cyan-500/10', border: 'border-cyan-500/20',
    color: 'text-cyan-400',
    top: '10%', right: '10%', delay: 0.15, lineStart: { x: 72, y: 12 },
  },
  {
    name: 'Carpenter', tool: 'hammer' as const,
    lineColor: 'from-amber-400/60',
    bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    color: 'text-amber-400',
    top: '38%', left: '2%', delay: 0.3, lineStart: { x: 16, y: 42 },
  },
  {
    name: 'Cleaner', tool: 'sparkles' as const,
    lineColor: 'from-emerald-400/60',
    bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    color: 'text-emerald-400',
    top: '38%', right: '2%', delay: 0.45, lineStart: { x: 84, y: 42 },
  },
];

const badges = [
  { text: 'Job Posted', icon: null, top: '5%', right: '36%', delay: 0.6 },
  { text: 'Smart Door Install', subtitle: 'Completed', top: '62%', left: '6%', delay: 0.8 },
  { text: 'Secure', icon: 'lock' as const, top: '5%', left: '36%', delay: 0.7 },
  { text: 'Connected', icon: 'wifi' as const, bottom: '5%', right: '36%', delay: 0.9 },
];

export function HeroVisual() {
  return (
    <div className="relative w-full h-[520px] hidden lg:block">
      {/* Glow behind house */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-[120px]"
      />

      {/* Connection curves */}
      {workers.map((w, i) => (
        <ConnectionLine key={`line-${i}`} start={w.lineStart} delay={w.delay} />
      ))}

      {/* Worker Cards */}
      {workers.map((w, i) => (
        <motion.div
          key={w.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + w.delay, duration: 0.6, ease: 'easeOut' }}
          className={`absolute flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-b from-navy-800/80 to-navy-900/80 backdrop-blur-xl border ${w.border} shadow-lg shadow-blue-500/5 cursor-default z-10`}
          style={{ top: w.top, left: w.left, right: w.right } as React.CSSProperties}
        >
          <div className={`rounded-lg ${w.bg} flex items-center justify-center flex-shrink-0`}>
            <WorkerAvatar color={w.tool} tool={w.tool} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white whitespace-nowrap">{w.name}</span>
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0">
              <circle cx="8" cy="8" r="7" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="0.5" />
              <path d="M5 8.5 L7 10.5 L11 6" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      ))}

      {/* Central Smart Home Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [-2, 2, -2] }}
        transition={{
          opacity: { delay: 0.2, duration: 0.6 },
          scale: { delay: 0.2, duration: 0.6 },
          y: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative bg-gradient-to-b from-navy-800/80 to-navy-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-blue-500/5">
          <motion.div
            className="absolute -inset-1 rounded-2xl bg-blue-500/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ filter: 'blur(8px)' }}
          />
          <div className="relative flex items-center justify-center">
            <HouseSvg />
          </div>
          <div className="relative text-center mt-1">
            <p className="text-xs font-black text-white/70">Smart Home</p>
            <p className="text-[8px] font-bold text-blue-400/60 uppercase tracking-widest">Connected</p>
          </div>
        </div>
      </motion.div>

      {/* Micro UI Badges */}
      {badges.map((badge, i) => (
        <motion.div
          key={badge.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + badge.delay, duration: 0.5 }}
          className={`absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-b from-navy-800/70 to-navy-900/70 backdrop-blur-xl border border-white/5 shadow-lg z-10`}
          style={{ top: badge.top, bottom: badge.bottom, right: badge.right, left: badge.left }}
        >
          {badge.icon === 'lock' && <Lock className="w-3 h-3 text-emerald-400" />}
          {badge.icon === 'wifi' && <Wifi className="w-3 h-3 text-blue-400" />}
          {badge.subtitle ? (
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/60 whitespace-nowrap">{badge.text}</span>
              <span className="text-[7px] font-medium text-white/30">{badge.subtitle}</span>
            </div>
          ) : (
            <span className="text-[9px] font-bold text-white/60 whitespace-nowrap">{badge.text}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
