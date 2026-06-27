import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Wifi, CheckCircle } from 'lucide-react';

function HouseSvg() {
  return (
    <svg viewBox="0 0 200 160" className="w-44 h-36">
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
        <linearGradient id="roofSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="158" rx="90" ry="6" fill="rgba(59,130,246,0.08)" />

      {/* Side wall */}
      <polygon points="100,35 175,60 175,135 100,110" fill="url(#wallSide)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <rect x="115" y="70" width="20" height="25" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" />
      <rect x="116" y="71" width="18" height="23" rx="1.5" fill="#3B82F6" opacity="0.4" filter="url(#glow)">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Front wall */}
      <rect x="25" y="50" width="100" height="85" rx="2" fill="url(#wallFront)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* Left window */}
      <rect x="38" y="64" width="22" height="28" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
      <rect x="39" y="65" width="20" height="26" rx="1.5" fill="#3B82F6" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <line x1="49" y1="65" x2="49" y2="91" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      <line x1="39" y1="78" x2="60" y2="78" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />

      {/* Right front window */}
      <rect x="88" y="64" width="22" height="28" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
      <rect x="89" y="65" width="20" height="26" rx="1.5" fill="#3B82F6" opacity="0.5" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
      </rect>
      <line x1="99" y1="65" x2="99" y2="91" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      <line x1="89" y1="78" x2="110" y2="78" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />

      {/* Door */}
      <rect x="58" y="100" width="32" height="35" rx="2" fill="#0F172A" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" />
      <rect x="60" y="102" width="28" height="31" rx="1.5" fill="#1E293B" />
      <circle cx="84" cy="118" r="2" fill="rgba(59,130,246,0.4)" />
      <rect x="52" y="133" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />

      {/* Main roof */}
      <polygon points="75,10 25,55 175,55" fill="url(#roofGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <polygon points="75,10 25,55 100,55" fill="rgba(59,130,246,0.04)" />
      <polygon points="100,30 175,55 175,50 100,25" fill="url(#roofSide)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />

      {/* Chimney */}
      <rect x="130" y="18" width="16" height="28" rx="1.5" fill="#1E293B" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <rect x="128" y="16" width="20" height="4" rx="1" fill="#334155" />
    </svg>
  );
}

function WorkerAvatar({ color, tool }: { color: string; tool: 'zap' | 'droplets' | 'hammer' | 'sparkles' }) {
  const c = color;

  return (
    <svg viewBox="0 0 38 44" className="w-10 h-11">
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

const workerData = [
  { label: 'Electrician', tool: 'zap' as const, color: '#EAB308', top: '12%', left: '6%', delay: 0 },
  { label: 'Plumber', tool: 'droplets' as const, color: '#06B6D4', top: '12%', right: '6%', delay: 0.15 },
  { label: 'Carpenter', tool: 'hammer' as const, color: '#D97706', bottom: '12%', left: '6%', delay: 0.3 },
  { label: 'Cleaner', tool: 'sparkles' as const, color: '#10B981', bottom: '12%', right: '6%', delay: 0.45 },
];

const microCards = [
  {
    icon: Wifi, label: 'Connected Platform',
    top: '4%', left: '50%', delay: 0.5,
  },
  {
    icon: Shield, label: 'Verified Workers',
    top: '46%', left: '3%', delay: 0.6,
  },
  {
    icon: Lock, label: 'Secure Payments',
    top: '46%', right: '3%', delay: 0.7,
  },
];

function generateParticles(count: number) {
  const particles: { id: number; x: number; y: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      delay: Math.random() * 5,
    });
  }
  return particles;
}

export function HeroVisual() {
  const particles = useMemo(() => generateParticles(18), []);

  return (
    <div className="relative w-full h-full hidden lg:block overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/20 pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            x: [0, Math.sin(p.id) * 20, 0],
            y: [0, Math.cos(p.id) * 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + p.id * 0.3,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {workerData.map((w, i) => {
          const startX = w.left ? 18 : w.right ? 82 : 50;
          const startY = w.top ? 18 : 82;
          const endX = 50;
          const endY = 50;
          return (
            <motion.path
              key={`line-${i}`}
              d={`M${startX},${startY} Q${(startX + endX) / 2},${startY} ${endX},${endY}`}
              fill="none"
              stroke="rgba(59,130,246,0.2)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.1, 0.4, 0.1] }}
              transition={{
                pathLength: { duration: 0.8, delay: w.delay, ease: 'easeOut' },
                opacity: { repeat: Infinity, duration: 2, delay: w.delay, ease: 'easeInOut' },
              }}
            />
          );
        })}
      </svg>

      {/* Worker Cards */}
      {workerData.map((w, i) => (
        <motion.div
          key={w.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + w.delay, duration: 0.6, ease: 'easeOut' }}
          className="absolute flex items-center gap-3 px-4 py-3 z-10"
          style={{
            top: w.top,
            bottom: w.bottom,
            left: w.left,
            right: w.right,
            width: 170,
            height: 80,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${w.color}15` }}
          >
            <WorkerAvatar color={w.color} tool={w.tool} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white whitespace-nowrap">{w.label}</span>
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
        animate={{ opacity: 1, scale: 1, y: -10 }}
        transition={{
          opacity: { delay: 0.2, duration: 0.6 },
          scale: { delay: 0.2, duration: 0.6 },
          y: {
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
            repeatType: 'reverse',
          },
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ width: 420, height: 420 }}
      >
        <div
          className="relative w-full h-full flex flex-col items-center justify-center rounded-3xl"
          style={{
            background: 'linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 80px rgba(59,130,246,0.35)',
          }}
        >
          <div className="flex items-center justify-center mb-4">
            <HouseSvg />
          </div>
          <p className="text-base font-black text-white/80">Smart Home</p>
          <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">Connected</p>
        </div>
      </motion.div>

      {/* Micro UI Cards */}
      {microCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + card.delay, duration: 0.5 }}
          className="absolute z-10 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg"
          style={{
            top: card.top,
            left: card.left,
            right: card.right,
            transform: card.left === '50%' ? 'translateX(-50%)' : undefined,
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <card.icon className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-bold text-white/70 whitespace-nowrap">{card.label}</span>
        </motion.div>
      ))}

      {/* Job Posted Card (below house) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute z-10 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
        style={{
          bottom: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white whitespace-nowrap">Job Posted</span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap"
              style={{
                background: 'rgba(16,185,129,0.15)',
                color: '#10B981',
              }}
            >
              Completed
            </span>
          </div>
          <span className="text-[10px] font-medium text-white/40 whitespace-nowrap mt-0.5">
            Smart Door Installation
          </span>
        </div>
      </motion.div>
    </div>
  );
}
